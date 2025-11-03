import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с сообщениями поддержки (создание, получение, ответ администратора)
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными сообщений поддержки
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            cursor.execute("""
                SELECT id, user_name, message, admin_response, status, 
                       created_at, responded_at 
                FROM t_p90162129_fartburger_site.support_messages 
                ORDER BY created_at DESC
            """)
            messages = cursor.fetchall()
            
            result = []
            for msg in messages:
                result.append({
                    'id': msg['id'],
                    'user_name': msg['user_name'],
                    'message': msg['message'],
                    'admin_response': msg['admin_response'],
                    'status': msg['status'],
                    'created_at': msg['created_at'].isoformat() if msg['created_at'] else None,
                    'responded_at': msg['responded_at'].isoformat() if msg['responded_at'] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'messages': result})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_name = body_data.get('user_name', 'Аноним')
            message = body_data.get('message', '')
            
            if not message:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Message is required'})
                }
            
            cursor.execute("""
                INSERT INTO t_p90162129_fartburger_site.support_messages 
                (user_name, message, status, created_at) 
                VALUES (%s, %s, 'pending', NOW())
                RETURNING id, user_name, message, status, created_at
            """, (user_name, message))
            
            new_message = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': {
                        'id': new_message['id'],
                        'user_name': new_message['user_name'],
                        'message': new_message['message'],
                        'status': new_message['status'],
                        'created_at': new_message['created_at'].isoformat()
                    }
                })
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            message_id = body_data.get('id')
            admin_response = body_data.get('admin_response', '')
            
            if not message_id or not admin_response:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'ID and admin_response are required'})
                }
            
            cursor.execute("""
                UPDATE t_p90162129_fartburger_site.support_messages 
                SET admin_response = %s, status = 'answered', responded_at = NOW()
                WHERE id = %s
                RETURNING id, user_name, message, admin_response, status, responded_at
            """, (admin_response, message_id))
            
            updated_message = cursor.fetchone()
            conn.commit()
            
            if not updated_message:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Message not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': {
                        'id': updated_message['id'],
                        'user_name': updated_message['user_name'],
                        'message': updated_message['message'],
                        'admin_response': updated_message['admin_response'],
                        'status': updated_message['status'],
                        'responded_at': updated_message['responded_at'].isoformat()
                    }
                })
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        cursor.close()
        conn.close()
