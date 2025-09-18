# File Upload with User Authentication

## Usage Example

When you implement authentication in your forms, you can pass the user ID to enable RLS policies:

```jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import FileUploadWithFolders from './FileUploadWithFolders';

const MyFormComponent = () => {
  const [userId, setUserId] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Get current user if authenticated
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  return (
    <FileUploadWithFolders
      files={files}
      onFilesChange={setFiles}
      formType="service-request"
      companyName="ABC Construction"
      projectName="Building Project"
      userId={userId}  // Pass user ID for RLS policies
    />
  );
};
```

## RLS Policy Setup

Once you have user authentication, create this RLS policy in Supabase:

```sql
-- Allow users to delete only their own uploaded files
CREATE POLICY "Users can delete their own uploaded files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'service-selection-fileupload'
  AND (metadata ->> 'user_id') = auth.uid()
);

-- Allow users to view their own files
CREATE POLICY "Users can view their own uploaded files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'service-selection-fileupload'
  AND (metadata ->> 'user_id') = auth.uid()
);
```

## Anonymous Users

For forms without authentication:
- Don't pass the `userId` prop
- Session-based security will still work
- Files can only be deleted within the same form session

## Metadata Structure

Files uploaded with userId will have this metadata:
```json
{
  "session_id": "abc123-def456-...",  // Form session ID
  "user_id": "user-uuid-here"         // Authenticated user ID
}
```

This enables both session-level and user-level security.