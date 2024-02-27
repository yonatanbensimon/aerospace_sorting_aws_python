import json
import pandas as pd
import boto3
from io import StringIO

s3 = boto3.client('s3')

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    bucket_name = body.get('bucketName')
    file_key = body.get('fileName')
    
    file_obj = s3.get_object(Bucket= bucket_name, Key= file_key)
    body = file_obj['Body']
    string_content = body.read().decode('utf-8')
    
    df = pd.read_csv(StringIO(string_content))

    # Ensure 'flight_date' is in datetime format
    df['flight_date'] = pd.to_datetime(df['flight_date'], format='%d.%m.%y')
    
    # Sort by 'flight_date'
    df_sorted = df.sort_values(by='flight_date')
    
    # Convert sorted DataFrame to CSV
    csv_buffer = StringIO()
    df_sorted.to_csv(csv_buffer, index=False)
    
    file_key = 'sorted_by_date.csv'
    s3.put_object(Bucket=bucket_name, Key=file_key, Body=csv_buffer.getvalue())
    
    presigned_url = s3.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': file_key}, ExpiresIn=3600)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps({'downloadUrl': presigned_url})
    }
