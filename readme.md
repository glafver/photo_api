REST API with mySQL-database which will be a backend for future foto-app





# Photo API endpoints

- All passwords **must** be salted and hashed.
- All received data **must** be sanitized and validated.
- All endpoints for photos and albums **must** require authentication.

## For G

- HTTP Basic Authentication must be used.

## For VG

- JSON Web Tokens must be used.
- Refresh of access token must work.
- As well as the sections below marked **[VG]**.

# Route Map

## Albums

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| GET     | /albums                           | Get all albums                         |
| GET     | /albums/:albumId                  | Get a single album                     |
| POST    | /albums                           | Create a new album                     |
| PUT     | /albums/:albumId                  | Update an album                        |
| POST    | /albums/:albumId/photos           | Add a photo an album                   |

### VG

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| POST    | /albums/:albumId/photos           | Add multiple photos an album           |
| DELETE  | /albums/:albumId/photos/:photoId  | Remove a photo from an album           |
| DELETE  | /albums/:albumId                  | Delete an album                        |

## Photos

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| GET     | /photos                           | Get all photos                         |
| GET     | /photos/:photoId                  | Get a single photo                     |
| POST    | /photos                           | Create a new photo                     |
| PUT     | /photos/:photoId                  | Update a photo                         |

### VG

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| DELETE  | /photos/:photoId                  | Delete a photo                         |

## Users

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| POST    | /register                         | Register a new user                    |

### VG

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| POST    | /login                            | Log in a user                          |
| POST    | /refresh                          | Get a new access token                 |

------
------

# Users

## `POST /register`

Register a new user.

### Parameters

*None*

### Body

```json
{
  "email": "jn@badcameraphotography.com",
  "password": "omg-smile",
  "first_name": "Johan",
  "last_name": "Nordström"
}
```

- `email` *string* **required** must be a valid email *and* not already exist
- `password` *string* **required** must be at least 6 chars long
- `first_name` *string* **required** must be at least 3 chars long
- `last_name` *string* **required** must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "email": "jn@badcameraphotography.com",
    "first_name": "Johan",
    "last_name": "Nordström"
  }
}
```

- `password` **must not** be included in response

------

## **[VG]** `POST /login`

Log in a user.

### Parameters

*None*

### Body

```json
{
  "email": "jn@badcameraphotography.com",
  "password": "omg-smile",
}
```

- `email` *string* **required** must be a valid email *and* exist
- `password` *string* **required** must be at least 6 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo4LCJlbWFpbCI6ImpuQGJhZGNhbWVyYXBob3RvZ3JhcGh5LmNvbSJ9LCJpYXQiOjE2NDU3Mzg2MzIsImV4cCI6MTY0NTgyNTAzMn0.TzOQmmUEkz8p5e27AU29EeN3SEcRM5Ne5yaz-RJYpYc",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo4LCJlbWFpbCI6ImpuQGJhZGNhbWVyYXBob3RvZ3JhcGh5LmNvbSJ9LCJpYXQiOjE2NDU3Mzg2MzIsImV4cCI6MTY0NjM0MzQzMn0.ISvo4OApoIwLJ6MKvt8k-blW-rLzNErjSjvKCf1xuig"
  }
}
```

------

## **[VG]** `POST /refresh`

Get a new access token.

### Headers

`Authorization: Bearer {refreshToken}`

### Parameters

*None*

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo4LCJlbWFpbCI6ImpuQGJhZGNhbWVyYXBob3RvZ3JhcGh5LmNvbSJ9LCJpYXQiOjE2NDU3MzkxODIsImV4cCI6MTY0NTgyNTU4Mn0.giP2SDTKI8hWSqrBjMORDkpYaYS47ZQUdl317O1tKI4",
  }
}
```

------
------

# Photos

## `GET /photos`

Returns a list of the user's photos.

### Parameters

*None*

### Request

*None*

### Response 200 OK

```json
{
  "status": "success",
  "data": [
    {
      "id": 42,
      "title": "Confetti Photo #1",
      "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      "comment": "Confetti"
    },
    {
      "id": 43,
      "title": "Confetti Photo #2",
      "url": "https://images.unsplash.com/photo-1481162854517-d9e353af153d",
      "comment": "Confetti #2"
    },
    {
      "id": 44,
      "title": "Confetti Photo #3",
      "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      "comment": "Confetti #3"
    },
    {
      "id": 45,
      "title": "Happy Photo",
      "url": "https://images.unsplash.com/photo-1454486837617-ce8e1ba5ebfe",
      "comment": "So happy"
    }
  ]
}
```

------

## `GET /photos/:photoId`

Get a single photo.

### Parameters

- `photoId` **required** The id of the photo

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "id": 42,
    "title": "Confetti Photo #1",
    "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "comment": "Confetti"
  }
}
```

------

## `POST /photos`

Create a new photo.

### Parameters

*None*

### Body

```json
{
  "title": "Confetti Photo #1",
  "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  "comment": "Confetti"
}
```

- `title` *string* **required** must be at least 3 chars long
- `url` *string* **required** must be a url
- `comment` *string* must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "Confetti Photo #1",
    "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "comment": "Confetti",
    "user_id": 4,
    "id": 47
  }
}
```

------

## `PUT /photos/:photoId`

Update an existing photo.

### Parameters

- `photoId` **required** The id of the photo

### Body

```json
{
  "title": "When life gives you confetti, celebrate",
  "comment": "Yolo"
}
```

- `title` *string* must be at least 3 chars long
- `url` *string* must be a url
- `comment` *string* must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "When life gives you confetti, celebrate",
    "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "comment": "Yolo"
    "user_id": 4,
    "id": 47
  }
}
```

------

## **[VG]** `DELETE /photos/:photoId`

Delete a photo (incl. the **links** to any albums, but not the albums themselves).

### Parameters

- `photoId` **required** The id of the photo

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------
------

# Albums

## `GET /albums`

Returns a list of the user's albums (excl. photos).

### Parameters

*None*

### Request

*None*

### Response 200 OK

```json
{
  "status": "success",
  "data": [
    {
      "id": 17,
      "title": "Confetti Album",
      "user_id": 4
    },
    {
      "id": 18,
      "title": "Happy Album",
      "user_id": 4
    }
  ]
}
```

------

## `GET /albums/:albumId`

Get a single album, incl. the album's photos.

### Parameters

- `albumId` **required** The id of the album

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "id": 17,
    "title": "Confetti Album",
    "photos": [
      {
        "id": 42,
        "title": "Confetti Photo #1",
        "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
        "comment": "Confetti",
        "user_id": 4
      },
      {
        "id": 43,
        "title": "Confetti Photo #2",
        "url": "https://images.unsplash.com/photo-1481162854517-d9e353af153d",
        "comment": "Confetti #2",
        "user_id": 4
      },
      {
        "id": 44,
        "title": "Confetti Photo #3",
        "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
        "comment": "Confetti #3",
        "user_id": 4
      }
    ]
  }
}
```

------

## `POST /albums`

Create a new album.

### Parameters

*None*

### Body

```json
{
  "title": "Confetti Album"
}
```

- `title` *string* **required** must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "Confetti Album",
    "user_id": 4,
    "id": 17
  }
}
```

------

## `PUT /albums/:albumId`

Update an existing album.

### Parameters

- `albumId` **required** The id of the album

### Body

```json
{
  "title": "Confetti'R'Us"
}
```

- `title` *string* **required** must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "Confetti'R'Us",
    "user_id": 4,
    "id": 17
  }
}
```

------

## **[VG]** `DELETE /albums/:albumId`

Delete an album (incl. the **links** to the photos, but not the photos themselves).

### Parameters

- `albumId` **required** The id of the album

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------

## `POST /albums/:albumId/photos`

Add a photo to an album.

### Parameters

- `albumId` **required** The id of the album

### Body

```json
{
  "photo_id": 42
}
```

- `photo_id` *integer* **required** must be an existing photo id

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------

## **[VG]** `POST /albums/:albumId/photos`

Add multiple photos to an album.

### Parameters

- `albumId` **required** The id of the album

### Body

```json
{
  "photo_id": [42, 43, 44]
}
```

- `photo_id` *[integer]* **required** must be an array of existing photo ids

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------

## **[VG]** `DELETE /albums/:albumId/photos/:photoId`

Remove a photo from an album (but not the photo itself!)

### Parameters

- `albumId` **required** The id of the album
- `photoId` **required** The id of the photo

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```
