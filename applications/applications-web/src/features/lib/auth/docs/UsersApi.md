# UsersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**usersEmailEmailGet**](UsersApi.md#usersemailemailget) | **GET** /users/email/{email} | Найти пользователя по Email |
| [**usersGet**](UsersApi.md#usersget) | **GET** /users | Получить список пользователей |
| [**usersIdDelete**](UsersApi.md#usersiddelete) | **DELETE** /users/{id} | Удалить пользователя |
| [**usersIdGet**](UsersApi.md#usersidget) | **GET** /users/{id} | Получить пользователя по ID |
| [**usersIdPut**](UsersApi.md#usersidput) | **PUT** /users/{id} | Обновить профиль пользователя |
| [**usersIdRolePatch**](UsersApi.md#usersidrolepatch) | **PATCH** /users/{id}/role | Обновить роль пользователя |
| [**usersPost**](UsersApi.md#userspost) | **POST** /users | Создать пользователя |



## usersEmailEmailGet

> ModelsUser usersEmailEmailGet(email)

Найти пользователя по Email

Ищет и возвращает профиль пользователя по его электронной почте

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersEmailEmailGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // string | Email адрес пользователя
    email: email_example,
  } satisfies UsersEmailEmailGetRequest;

  try {
    const data = await api.usersEmailEmailGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **email** | `string` | Email адрес пользователя | [Defaults to `undefined`] |

### Return type

[**ModelsUser**](ModelsUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | Email is required |  -  |
| **404** | User Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## usersGet

> Array&lt;ModelsUser&gt; usersGet()

Получить список пользователей

Возвращает массив всех зарегистрированных пользователей

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  try {
    const data = await api.usersGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ModelsUser&gt;**](ModelsUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## usersIdDelete

> { [key: string]: string; } usersIdDelete(id)

Удалить пользователя

Удаляет запись о пользователе из базы данных по его ID

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // number | Идентификатор пользователя
    id: 56,
  } satisfies UsersIdDeleteRequest;

  try {
    const data = await api.usersIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Идентификатор пользователя | [Defaults to `undefined`] |

### Return type

**{ [key: string]: string; }**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | {\&quot;status\&quot;: \&quot;deleted\&quot;} |  -  |
| **400** | Invalid ID |  -  |
| **500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## usersIdGet

> ModelsUser usersIdGet(id)

Получить пользователя по ID

Возвращает профиль пользователя по его числовому идентификатору

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // number | Идентификатор пользователя
    id: 56,
  } satisfies UsersIdGetRequest;

  try {
    const data = await api.usersIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Идентификатор пользователя | [Defaults to `undefined`] |

### Return type

[**ModelsUser**](ModelsUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | Invalid ID |  -  |
| **404** | User Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## usersIdPut

> { [key: string]: string; } usersIdPut(id, user)

Обновить профиль пользователя

Полностью обновляет информацию о пользователе по его ID

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // number | Идентификатор пользователя
    id: 56,
    // ModelsUser | Новые данные пользователя
    user: ...,
  } satisfies UsersIdPutRequest;

  try {
    const data = await api.usersIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Идентификатор пользователя | [Defaults to `undefined`] |
| **user** | [ModelsUser](ModelsUser.md) | Новые данные пользователя | |

### Return type

**{ [key: string]: string; }**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | {\&quot;status\&quot;: \&quot;updated\&quot;} |  -  |
| **400** | Invalid ID или Invalid JSON |  -  |
| **500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## usersIdRolePatch

> { [key: string]: string; } usersIdRolePatch(id, role)

Обновить роль пользователя

Частичное обновление: изменяет только роль пользователя (например, admin, user)

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersIdRolePatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // number | Идентификатор пользователя
    id: 56,
    // string | JSON вида {
    role: role_example,
  } satisfies UsersIdRolePatchRequest;

  try {
    const data = await api.usersIdRolePatch(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `number` | Идентификатор пользователя | [Defaults to `undefined`] |
| **role** | `string` | JSON вида { | |

### Return type

**{ [key: string]: string; }**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | {\&quot;status\&quot;: \&quot;role updated\&quot;} |  -  |
| **400** | Invalid ID, Invalid JSON или пустая роль |  -  |
| **500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## usersPost

> ModelsUser usersPost(user)

Создать пользователя

Регистрирует нового пользователя. Поля name, email и password обязательны.

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // ModelsUser | Данные нового пользователя
    user: ...,
  } satisfies UsersPostRequest;

  try {
    const data = await api.usersPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **user** | [ModelsUser](ModelsUser.md) | Данные нового пользователя | |

### Return type

[**ModelsUser**](ModelsUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |
| **400** | Invalid JSON или пустые обязательные поля |  -  |
| **500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

