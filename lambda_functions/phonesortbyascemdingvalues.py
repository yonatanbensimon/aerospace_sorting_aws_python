import json
import pandas as pd
import boto3
from io import StringIO

s3 = boto3.client('s3')

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    bucket_name = body.get('bucketName')
    file_key = body.get('fileName')

    file_obj = s3.get_object(Bucket=bucket_name, Key=file_key)
    body = file_obj['Body']
    string_content = body.read().decode('utf-8')

    phones = pd.read_csv(StringIO(string_content))
    
    #We create a new column "number_excluding_area_code"
    phones['number_excluding_area_code'] = phones['phone_number'].str.replace(r'\(\d{3}\)\s', '', regex=True) #We remove the area code
    
    sorted_phones = phones.sort_values(by='number_excluding_area_code')
    sorted_phones = sorted_phones.drop(columns=['number_excluding_area_code'])

    csv_buffer = StringIO()
    sorted_phones.to_csv(csv_buffer, index=False)

    sorted_file_key = 'sorted-ascending-' + file_key
    s3.put_object(Bucket=bucket_name, Key=sorted_file_key, Body=csv_buffer.getvalue())
    
    presigned_url = s3.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': sorted_file_key}, ExpiresIn=3600)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps({'downloadUrl': presigned_url})
    }
