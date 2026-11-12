"""Verifica inicialização serverless sem acessar dados reais do Firebase."""

import json
import unittest
from unittest.mock import patch

from backend import app as backend
from api.index import app


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.old_db = backend.db
        backend.db = None

    def tearDown(self):
        backend.db = self.old_db

    def test_missing_credential_fails_closed_without_leaking_details(self):
        with patch.dict('os.environ', {}, clear=True), patch.object(
            backend.credentials, 'Certificate', side_effect=FileNotFoundError('PRIVATE_DETAIL')
        ):
            for path in ['/api/health', '/api/public-info/test', '/api/admin/users']:
                response = self.client.get(path)
                self.assertEqual(response.status_code, 503)
                self.assertNotIn('PRIVATE_DETAIL', response.get_data(as_text=True))

    def test_environment_credential_initializes_once_and_preserves_auth(self):
        service_account = {'type': 'service_account', 'project_id': 'test-only'}
        with patch.dict('os.environ', {'FIREBASE_SERVICE_ACCOUNT_JSON': json.dumps(service_account)}), \
             patch.object(backend.credentials, 'Certificate') as certificate, \
             patch.object(backend.firebase_admin, 'get_app', side_effect=ValueError), \
             patch.object(backend.firebase_admin, 'initialize_app') as initialize, \
             patch.object(backend.firestore, 'client') as firestore_client:
            firestore_client.return_value.project = 'test-only'
            self.assertEqual(self.client.get('/api/health').json, {
                'status': 'ok', 'projectId': 'test-only'
            })
            self.assertEqual(self.client.get('/api/health').status_code, 200)
            self.assertEqual(self.client.get('/api/admin/users').status_code, 401)
            certificate.assert_called_once_with(service_account)
            initialize.assert_called_once()
            firestore_client.assert_called_once()

    def test_cors_preflight_does_not_require_firebase(self):
        with patch.object(backend, 'initialize_firebase') as initialize:
            response = self.client.options('/api/admin/users', headers={
                'Origin': 'http://localhost:5173',
                'Access-Control-Request-Method': 'GET',
            })
            self.assertEqual(response.status_code, 200)
            initialize.assert_not_called()


if __name__ == '__main__':
    unittest.main()
