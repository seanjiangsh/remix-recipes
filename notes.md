# Notes

## Authorization Rules of the Login Page

| Action | Entity           | Condition     | Response         |
| ------ | ---------------- | ------------- | ---------------- |
| read   | login page       | not logged in | redirect to /app |
| create | magic link email | not logged in | redirect to /app |

## Authorization Rules of the Pantry Page

| Action | Entity            | Condition | Response                                    |
| ------ | ----------------- | --------- | ------------------------------------------- |
| CRUD   | pantry/shelf/item | logged in | redirect to /login                          |
| read   | shelves/items     | owned     | N/A (only display shelves/items user owned) |
| create | shelf             | owned     | N/A (user cannot create shelf for others)   |
| create | item              | owned     | N/A (user cannot create item for others)    |
| delete | shelf             | owned     | throw error response                        |
| delete | item              | owned     | throw error response                        |
| update | shelf             | owned     | throw error response                        |

## Authorization Rules of the $recipeId Route

| Action | Entity               | Condition | Response             |
| ------ | -------------------- | --------- | -------------------- |
| read   | recipe + ingredients | owned     | throw error response |
| update | recipe + ingredients | owned     | throw error response |
| delete | recipe + ingredients | owned     | throw error response |
| create | ingredients          | owned     | throw error response |
| delete | ingredients          | owned     | throw error response |
