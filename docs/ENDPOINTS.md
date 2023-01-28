## API Endpoints

<details>
  <summary>Create a new habit</summary>

  ### Create a new habit
  **Endpoint**: POST /habits  
  **Description**: This endpoint create a new habit.  
  **Parameters**:  
  Body:
  ```json
  {
    "title": "Practice Exercise in Sunday, Monday and Tuesday",
    "weekDays": [0, 1, 2],
  }
  ```

  **Response**:  
  Status: 201 Created  
  Body: 
  ```json
  {
    "id": "20023231-dbf0-453d-b4ef-2cf16a218882",
    "title": "Practice Exercise in Sunday, Monday and Tuesday",
    "created_at": "2023-07-16T03:00:00.000Z"
  }
  ```
</details>

<details>
  <summary>List habits by date<summary>

  ### List habits by date
  **Endpoint**: GET /days  
  **Description**: This endpoint list all habits that can be completed in some specified date.  
  **Parameters**:  ?date=2023-07-16T03:00:00.000Z  
  Body: **No body**  
    
  **Response**:  
  Status: 200 Ok  
  Body:   
  ```json
  {
    "possibleHabits": [
      {
        "id": "20023231-dbf0-453d-b4ef-2cf16a218882",
        "title": "Practice Exercise in Sunday, Monday and Tuesday",
        "created_at": "2023-07-16T03:00:00.000Z"
      }
    ],
    "completedHabits": [
      "20023231-dbf0-453d-b4ef-2cf16a218882"
    ]
  }
  ```
<details>

<details>
  <summary>Toggle habit<summary>

  ### Toggle habit
  **Endpoint**: PATCH /habits/:habitId/toggle  
  **Description**: This endpoint change state from habit, if is completed or isn't completed  
  **Parameters**: :habitId -> 20023231-dbf0-453d-b4ef-2cf16a218882  
  Body: **No body**  
    
  **Response**:  
  Status: 200 Ok  
  Body: **No body**
<details>

<details>
  <summary>Get summary<summary>

  ### Get summary
  **Endpoint**: GET /summary  
  **Description**: This endpoint changes the status of the habit, if it is completed or not completed  
  **Parameters**: **No paramaters**  
  Body: **No body**  
    
  **Response**:  
  Status: 200 Ok  
  Body: **No body**  
<details>
