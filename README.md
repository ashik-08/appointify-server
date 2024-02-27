### Add a .env file in your root project
file structure will be followed: (N.B. without the quotation)

DB_NAME='your_db_name' <br>
DB_URI='your_db_url' <br>
ACCESS_TOKEN_SECRET='64-bit_token' <br>





 **API Documentation for Events API**

**Base URL:** http://your-api-base-url/events


**Available Endpoints:**

**1. Retrieve All Events:**

   * **GET /events**
   * **Returns:** Array of all events in JSON format
   * **Example:** 
     ```json
     [
       {
         "_id": "1234567890",
         "name": "Event 1",
         "description": "This is the first event.",
         "date": "2024-02-28T00:12:00.000Z",
         "user": "user123",
         "participants": ["participant1", "participant2"]
       },
       ...
     ]
     ```

**2. Retrieve Events for a Specific User:**

   * **GET /events/:userId**
   * **Parameters:**
     - **userId:** The ID of the user whose events you want to retrieve
   * **Returns:** Array of events associated with the specified user

**3. Retrieve a Single Event:**

   * **GET /events/singleEvent/:eventId**
   * **Parameters:**
     - **eventId:** The ID of the event you want to retrieve
   * **Returns:** The specific event with the given ID

**4. Create a New Event:**

   * **POST /events/:userId**
   * **Parameters:**
     - **userId:** The ID of the user creating the event
   * **Body:** Event data in JSON format (e.g., name, description, date)
   * **Returns:** The newly created event

**5. Update an Event:**

   * **PUT /events/updateEvent/:eventId**
   * **Parameters:**
     - **eventId:** The ID of the event you want to update
   * **Body:** Updated event data in JSON format
   * **Returns:** The updated event

**6. Delete an Event:**

   * **DELETE /events/removeEvent/:eventId**
   * **Parameters:**
     - **eventId:** The ID of the event you want to delete
   * **Returns:** A success message if the event was deleted successfully

**7. Retrieve Participants for an Event:**

   * **GET /events/participants/:eventId**
   * **Parameters:**
     - **eventId:** The ID of the event whose participants you want to retrieve
   * **Returns:** Array of participants for the specified event

**8. Add or Update Participants for an Event:**

   * **POST /events/addParticipants/:eventId**
   * **Parameters:**
     - **eventId:** The ID of the event to add or update participants for
   * **Body:** Array of participant IDs or objects in JSON format

**9. Update a Participant in an Event:**

   * **PUT /events/:eventId/participants/:participantId**
   * **Parameters:**
     - **eventId:** The ID of the event containing the participant
     - **participantId:** The ID of the participant to update
   * **Body:** Updated participant data in JSON format

**10. Remove a Participant from All Events:**

   * **DELETE /events/removeParticipant/:participantId**
   * **Parameters:**
     - **participantId:** The ID of the participant to remove

**11. Remove All Participants from an Event:**

   * **DELETE /events/removeAllParticipants/:eventId**
   * **Parameters:**
     - **eventId:** The ID of the event to remove participants from
