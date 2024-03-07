### Add a .env file in your root project
file structure will be followed: (N.B. without the quotation)

DB_NAME='your_db_name' <br>
DB_URI='your_db_url' <br>
ACCESS_TOKEN_SECRET='64-bit_token' <br>



**User API Documentation**

**Base URL:** http://your-api-base-url/users

**Authentication:** (Specify the authentication method required, if any)

**Available Endpoints:**

**1. Get All Users:**

   * **GET /users**
   * **Requires Permission:** Admin
   * **Returns:** An array of all users in the system

**2. Check User Admin Access:**

   * **GET /users/admin/:email**
   * **Parameters:**
     - `email`: The email address of the user to check
   * **Returns:**
     - `true` if the user has admin rights, `false` otherwise

**3. Get User Data:**

   * **GET /users/:email**
   * **Requires Permission:** User must be logged in and the requested email must match their own
   * **Parameters:**
     - `email`: The email address of the user
   * **Returns:** The user data for the specified email address

**4. Add a User:**

   * **POST /users**
   * **Body:** JSON object containing new user data (e.g., name, email, password)
   * **Returns:** The newly created user object

**5. Update User Profile:**

   * **PUT /users/:email**
   * **Requires Permission:** User must be logged in and the requested email must match their own
   * **Parameters:**
     - `email`: The email address of the user to update
   * **Body:** JSON object containing updated user data (e.g., name, photo)
   * **Returns:** The updated user object

**6. Get User Availability:**

   * **GET /users/availability/:userId**
   * **Parameters:**
     - `userId`: The ID of the user whose availability you want to retrieve
   * **Returns:** The availability data for the specified user

**7. Add Availability to User:**

   * **POST /users/availability/:userEmail**
   * **Requires Permission:** User must be logged in and the `userEmail` must match their own
   * **Parameters:**
     - `userEmail`: The email address of the user
   * **Body:** JSON object containing availability data (e.g., day, slots)
   * **Returns:** The updated user object with the added availability

**8. Update Slots for a Specific Day:**

   * **PUT /users/availability/:userEmail/slots/:slotId**
   * **Requires Permission:** User must be logged in and the `userEmail` must match their own
   * **Parameters:**
     - `userEmail`: The email address of the user
     - `slotId`: The ID of the slot to update
   * **Body:** JSON object containing updated slot data (e.g., start_time, end_time)
   * **Returns:** The updated user object with the modified availability

**9. Remove a Slot from User's Availability:**

   * **DELETE /users/removeSlot/:userEmail/slots/:slotId**
   * **Requires Permission:** User must be logged in and the `userEmail` must match their own
   * **Parameters:**
     - `userEmail`: The email address of the user
     - `slotId`: The ID of the slot to remove
   * **Returns:** The updated user object with the removed slot

**10. Remove a Specific Availability Object from User:**

   * **DELETE /users/removeDay/:userEmail/day/:dayId**
   * **Requires Permission:** User must be logged in and the `userEmail` must match their own
   * **Parameters:**
     - `userEmail`: The email address of the user
     - `dayId`: The ID of the availability object to remove
   * **Returns:** The updated user object with the removed availability object



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

   * **PUT /events/updateParticipants/:eventId/:participantId**
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
