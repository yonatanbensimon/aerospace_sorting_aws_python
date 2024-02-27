import boto3
import pandas as pd
from io import StringIO, BytesIO
import json

s3 = boto3.client('s3')

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    bucket_name = body.get('bucketName')
    file_key = body.get('fileName')
    
    # Read the CSV file from S3 into a DataFrame
    response = s3.get_object(Bucket=bucket_name, Key=file_key)
    csv_content = response['Body'].read().decode('utf-8')
    df = pd.read_csv(StringIO(csv_content))
    
    # Perform calculations
    average_temp_avg = df['average_temp'].mean()
    fuel_consumption_avg = df['fuel_consumption'].mean()
    lowest_temp = df['average_temp'].min()
    highest_temp = df['average_temp'].max()
    lowest_fuel = df['fuel_consumption'].min()
    highest_fuel = df['fuel_consumption'].max()
    total_entries = len(df)
    
    fault_code_counts = df['fault_code'].value_counts(normalize=True) * 100
    yes_percentage = fault_code_counts.get('Yes', 0)
    no_percentage = fault_code_counts.get('No', 0)
    
    analysis_results = (f"Average Temperature: {average_temp_avg}\n"
                        f"Average Fuel Consumption: {fuel_consumption_avg}\n"
                        f"Lowest Temperature: {lowest_temp}\n"
                        f"Highest Temperature: {highest_temp}\n"
                        f"Lowest Fuel Consumption: {lowest_fuel}\n"
                        f"Highest Fuel Consumption: {highest_fuel}\n"
                        f"Total Number of Trips: {total_entries}\n"
                        f"Percentage of 'Yes' in Fault Code: {yes_percentage}%\n"
                        f"Percentage of 'No' in Fault Code: {no_percentage}%\n")

    # Define a key for the result file
    result_file_key = 'analysis-result.txt'
    
    # Convert analysis result to bytes
    result_bytes = BytesIO(analysis_results.encode())
    
    # Save the analysis result to S3
    s3.put_object(Bucket=bucket_name, Key=result_file_key, Body=result_bytes.getvalue())
    
    # Generate a presigned URL for downloading the file
    presigned_url = s3.generate_presigned_url('get_object',
                                              Params={'Bucket': bucket_name, 'Key': result_file_key},
                                              ExpiresIn=3600)  # URL expires in 1 hour
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps({'downloadUrl': presigned_url})
    }
