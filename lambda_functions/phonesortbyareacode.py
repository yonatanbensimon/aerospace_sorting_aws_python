#Yonatan Bensimon - AWS/Python/Panda Project

import json
import pandas as pd #Importing Panda
import boto3
from io import StringIO

s3 = boto3.client('s3')

def lambda_handler(event, context):
    
    #We first access the bucket_name and the file_key from the event
    
    
    body = json.loads(event.get('body', '{}'))
    bucket_name = body.get('bucketName')
    file_key = body.get('fileName')
    
    

    #Then, we fetch the CSV file using those parameters

    file_obj = s3.get_object(Bucket= bucket_name, Key= file_key)
    body = file_obj['Body']
    string_content = body.read().decode('utf-8')

    #Now we can use a pandas dataframe to analyze our data

    phones = pd.read_csv(StringIO(string_content))

    #We create a specific area_code column that will contain all 3 digits area codes in ()
    phones['area_code'] = phones['phone_number'].str.extract(r'\((\d{3})\)')[0]

    #Now we can sort our entire dataframe by area code
    sorted_phones = phones.sort_values(by='area_code')
    sorted_phones = sorted_phones.drop(columns=['area_code'])

    #We convert back to CSV
    csv_buffer = StringIO()
    sorted_phones.to_csv(csv_buffer, index=False)

    #We save it back to the bucket
    sorted_file_key = 'sorted-' + file_key
    s3.put_object(Bucket=bucket_name, Key=sorted_file_key, Body=csv_buffer.getvalue())

    # Generate a pre-signed URL for the sorted file
    presigned_url = s3.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': sorted_file_key}, ExpiresIn=3600)
    print("Received event: " + json.dumps(event))

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps({'downloadUrl': presigned_url})
    }
