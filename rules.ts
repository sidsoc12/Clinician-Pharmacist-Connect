//Rules not ready for deployment - should be tested and improved.
service cloud.firestore 
{
  match /databases/{database}/documents 
  {
  //Rules:
  //Clinician and Pharmacist should be able to edit/view own documents
  //Clinician can edit/view pharmacist documents for the pharmacist that they assigned prescriptions to
  //Pharmacist can edit/view clinician documents for the clinician they were assigned prescriptions from.
    match /users/{theuser}
    {
    //Basic allow user to control their documents
      allow read, write: if ((request.auth != null) && theuser == request.auth.token.email);
      // theuser == ('/'+ request.auth.token.email));
      match /prescriptions/{prescriptions}
      {
      //First Checks if the doc id is the user email - then allow user to edit their own prescriptions,
      //Next check if user is pharmacist accessing clinician prescription 
      //Lastly check if clinician is accessing pharmacist prescription
      allow read, write: if ((request.auth != null && theuser == request.auth.token.email) || ((request.auth != null) && (resource.data.Type == "Clinician") && (resource.data.ThePharmacistEmail == request.auth.token.email)) || 
      ((request.auth != null) && (request.resource.data.Type == "Pharmacist") && (request.resource.data.TheClinicianEmail == request.auth.token.email)));
      //Alert: Not sure if this last check works on first time doc creations, when the clinician creates a document in the pharmacist prescription subcollection;
      }
    }
    
    match /chats/{chat=**}
    {
    //Check if user email is in the chat doc id 
    //Alert: need to put request.auth.token.email into regex to work with matches()!
     allow read, write: if (request.auth != null) && (chat.matches(request.auth.token.email));
    }
  }
  }
