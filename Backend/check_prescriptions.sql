-- Run this SQL query to check your uploaded prescriptions
USE cura_ai;

SELECT 
    id,
    original_filename,
    file_type,
    processing_status,
    LEFT(extracted_text, 200) as extracted_text_preview,
    LEFT(medicines, 500) as medicines_preview,
    created_at
FROM prescriptions
ORDER BY created_at DESC
LIMIT 10;
