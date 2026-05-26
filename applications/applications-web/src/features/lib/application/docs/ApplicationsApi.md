# ApplicationsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**applicationsGet**](ApplicationsApi.md#applicationsget) | **GET** /applications | Получить список всех заявок |
| [**applicationsIdDelete**](ApplicationsApi.md#applicationsiddelete) | **DELETE** /applications/{id} | Удалить заявку |
| [**applicationsIdGet**](ApplicationsApi.md#applicationsidget) | **GET** /applications/{id} | Получить заявку по ID |
| [**applicationsIdPut**](ApplicationsApi.md#applicationsidput) | **PUT** /applications/{id} | Обновить данные заявки |
| [**applicationsPost**](ApplicationsApi.md#applicationspost) | **POST** /applications | Создать новую заявку |



## applicationsGet

> Array&lt;ModelsApplicationEntity&gt; applicationsGet()

Получить список всех заявок

Возвращает массив всех поданных заявок в системе

### Example

```ts
import {
  Configuration,
  ApplicationsApi,
} from '';
import type { ApplicationsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApplicationsApi();

  try {
    const data = await api.applicationsGet();
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

[**Array&lt;ModelsApplicationEntity&gt;**](ModelsApplicationEntity.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Missing or invalid token |  -  |
| **500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## applicationsIdDelete

> { [key: string]: string; } applicationsIdDelete(id)

Удалить заявку

Удаляет запись о заявке из базы данных по её уникальному ID

### Example

```ts
import {
  Configuration,
  ApplicationsApi,
} from '';
import type { ApplicationsIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApplicationsApi();

  const body = {
    // number | Идентификатор заявки
    id: 56,
  } satisfies ApplicationsIdDeleteRequest;

  try {
    const data = await api.applicationsIdDelete(body);
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
| **id** | `number` | Идентификатор заявки | [Defaults to `undefined`] |

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


## applicationsIdGet

> ModelsApplicationEntity applicationsIdGet(id)

Получить заявку по ID

Возвращает полную информацию о конкретной заявке по её идентификатору

### Example

```ts
import {
  Configuration,
  ApplicationsApi,
} from '';
import type { ApplicationsIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApplicationsApi();

  const body = {
    // number | Идентификатор заявки
    id: 56,
  } satisfies ApplicationsIdGetRequest;

  try {
    const data = await api.applicationsIdGet(body);
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
| **id** | `number` | Идентификатор заявки | [Defaults to `undefined`] |

### Return type

[**ModelsApplicationEntity**](ModelsApplicationEntity.md)

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
| **404** | Application not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## applicationsIdPut

> { [key: string]: string; } applicationsIdPut(id, application)

Обновить данные заявки

Полностью перезаписывает информацию в существующей заявке по её ID

### Example

```ts
import {
  Configuration,
  ApplicationsApi,
} from '';
import type { ApplicationsIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApplicationsApi();

  const body = {
    // number | Идентификатор заявки
    id: 56,
    // ServiceApplicationCreateDto | Новые данные заявки
    application: ...,
  } satisfies ApplicationsIdPutRequest;

  try {
    const data = await api.applicationsIdPut(body);
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
| **id** | `number` | Идентификатор заявки | [Defaults to `undefined`] |
| **application** | [ServiceApplicationCreateDto](ServiceApplicationCreateDto.md) | Новые данные заявки | |

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


## applicationsPost

> ServiceApplicationCreateDto applicationsPost(application)

Создать новую заявку

Принимает данные заявки и привязывает её к текущему авторизованному пользователю

### Example

```ts
import {
  Configuration,
  ApplicationsApi,
} from '';
import type { ApplicationsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApplicationsApi();

  const body = {
    // ServiceApplicationCreateDto | Данные для создания заявки
    application: ...,
  } satisfies ApplicationsPostRequest;

  try {
    const data = await api.applicationsPost(body);
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
| **application** | [ServiceApplicationCreateDto](ServiceApplicationCreateDto.md) | Данные для создания заявки | |

### Return type

[**ServiceApplicationCreateDto**](ServiceApplicationCreateDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |
| **400** | Invalid JSON или неверные параметры |  -  |
| **401** | Missing or invalid token |  -  |
| **500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

