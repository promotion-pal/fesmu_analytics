# ToiletsApi

All URIs are relative to *http://localhost:8000/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiToiletsGet**](ToiletsApi.md#apitoiletsget) | **GET** /api/toilets | Получить список всех туалетов |
| [**apiToiletsIdDelete**](ToiletsApi.md#apitoiletsiddelete) | **DELETE** /api/toilets/{id} | Удалить туалет |
| [**apiToiletsIdGet**](ToiletsApi.md#apitoiletsidget) | **GET** /api/toilets/{id} | Получить туалет по ID |
| [**apiToiletsIdPut**](ToiletsApi.md#apitoiletsidput) | **PUT** /api/toilets/{id} | Обновить туалет |
| [**apiToiletsPost**](ToiletsApi.md#apitoiletspost) | **POST** /api/toilets | Создать новый туалет |



## apiToiletsGet

> Array&lt;ModelsToilet&gt; apiToiletsGet()

Получить список всех туалетов

Возвращает массив всех туалетов, отсортированных по рейтингу

### Example

```ts
import {
  Configuration,
  ToiletsApi,
} from '';
import type { ApiToiletsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ToiletsApi();

  try {
    const data = await api.apiToiletsGet();
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

[**Array&lt;ModelsToilet&gt;**](ModelsToilet.md)

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


## apiToiletsIdDelete

> apiToiletsIdDelete(id)

Удалить туалет

Удаляет туалет по ID (мягкое удаление)

### Example

```ts
import {
  Configuration,
  ToiletsApi,
} from '';
import type { ApiToiletsIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ToiletsApi();

  const body = {
    // number | ID туалета
    id: 56,
  } satisfies ApiToiletsIdDeleteRequest;

  try {
    const data = await api.apiToiletsIdDelete(body);
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
| **id** | `number` | ID туалета | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | No Content |  -  |
| **400** | Bad Request |  -  |
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiToiletsIdGet

> ModelsToilet apiToiletsIdGet(id)

Получить туалет по ID

Возвращает информацию о туалете по его ID

### Example

```ts
import {
  Configuration,
  ToiletsApi,
} from '';
import type { ApiToiletsIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ToiletsApi();

  const body = {
    // number | ID туалета
    id: 56,
  } satisfies ApiToiletsIdGetRequest;

  try {
    const data = await api.apiToiletsIdGet(body);
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
| **id** | `number` | ID туалета | [Defaults to `undefined`] |

### Return type

[**ModelsToilet**](ModelsToilet.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | Bad Request |  -  |
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiToiletsIdPut

> ModelsToilet apiToiletsIdPut(id, updates)

Обновить туалет

Обновляет информацию о туалете по ID

### Example

```ts
import {
  Configuration,
  ToiletsApi,
} from '';
import type { ApiToiletsIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ToiletsApi();

  const body = {
    // number | ID туалета
    id: 56,
    // { [key: string]: any; } | Поля для обновления (is_clean, soap, name и т.д.)
    updates: Object,
  } satisfies ApiToiletsIdPutRequest;

  try {
    const data = await api.apiToiletsIdPut(body);
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
| **id** | `number` | ID туалета | [Defaults to `undefined`] |
| **updates** | `{ [key: string]: any; }` | Поля для обновления (is_clean, soap, name и т.д.) | |

### Return type

[**ModelsToilet**](ModelsToilet.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | Bad Request |  -  |
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiToiletsPost

> ModelsToilet apiToiletsPost(toilet)

Создать новый туалет

Добавляет новый туалет в базу данных

### Example

```ts
import {
  Configuration,
  ToiletsApi,
} from '';
import type { ApiToiletsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ToiletsApi();

  const body = {
    // ModelsToilet | Данные туалета
    toilet: ...,
  } satisfies ApiToiletsPostRequest;

  try {
    const data = await api.apiToiletsPost(body);
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
| **toilet** | [ModelsToilet](ModelsToilet.md) | Данные туалета | |

### Return type

[**ModelsToilet**](ModelsToilet.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |
| **400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

