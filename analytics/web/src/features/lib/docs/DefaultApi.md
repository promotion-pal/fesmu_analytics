# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**toiletsControllerAddRating**](DefaultApi.md#toiletscontrolleraddrating) | **POST** /toilets/{id}/ratings | Добавить отзыв к туалету |
| [**toiletsControllerCreateToilet**](DefaultApi.md#toiletscontrollercreatetoilet) | **POST** /toilets | Создать новый туалет |
| [**toiletsControllerGetAllRatings**](DefaultApi.md#toiletscontrollergetallratings) | **GET** /toilets/ratings | Получить все отзывы |
| [**toiletsControllerGetAllToilets**](DefaultApi.md#toiletscontrollergetalltoilets) | **GET** /toilets | Получить все туалеты с отзывами |
| [**toiletsControllerGetRatingsByToilet**](DefaultApi.md#toiletscontrollergetratingsbytoilet) | **GET** /toilets/{id}/ratings | Получить все отзывы конкретного туалета |
| [**toiletsControllerGetToiletById**](DefaultApi.md#toiletscontrollergettoiletbyid) | **GET** /toilets/{id} | Получить туалет по ID с его отзывами |



## toiletsControllerAddRating

> CreateToiletRatingDto toiletsControllerAddRating(id, createToiletRatingDto)

Добавить отзыв к туалету

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ToiletsControllerAddRatingRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number
    id: 8.14,
    // CreateToiletRatingDto
    createToiletRatingDto: ...,
  } satisfies ToiletsControllerAddRatingRequest;

  try {
    const data = await api.toiletsControllerAddRating(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |
| **createToiletRatingDto** | [CreateToiletRatingDto](CreateToiletRatingDto.md) |  | |

### Return type

[**CreateToiletRatingDto**](CreateToiletRatingDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## toiletsControllerCreateToilet

> CreateToiletRatingDto toiletsControllerCreateToilet(createToiletRatingDto)

Создать новый туалет

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ToiletsControllerCreateToiletRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // CreateToiletRatingDto
    createToiletRatingDto: ...,
  } satisfies ToiletsControllerCreateToiletRequest;

  try {
    const data = await api.toiletsControllerCreateToilet(body);
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
| **createToiletRatingDto** | [CreateToiletRatingDto](CreateToiletRatingDto.md) |  | |

### Return type

[**CreateToiletRatingDto**](CreateToiletRatingDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## toiletsControllerGetAllRatings

> Array&lt;CreateToiletRatingDto&gt; toiletsControllerGetAllRatings()

Получить все отзывы

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ToiletsControllerGetAllRatingsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.toiletsControllerGetAllRatings();
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

[**Array&lt;CreateToiletRatingDto&gt;**](CreateToiletRatingDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## toiletsControllerGetAllToilets

> Array&lt;CreateToiletRatingDto&gt; toiletsControllerGetAllToilets()

Получить все туалеты с отзывами

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ToiletsControllerGetAllToiletsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.toiletsControllerGetAllToilets();
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

[**Array&lt;CreateToiletRatingDto&gt;**](CreateToiletRatingDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## toiletsControllerGetRatingsByToilet

> Array&lt;CreateToiletRatingDto&gt; toiletsControllerGetRatingsByToilet(id)

Получить все отзывы конкретного туалета

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ToiletsControllerGetRatingsByToiletRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number
    id: 8.14,
  } satisfies ToiletsControllerGetRatingsByToiletRequest;

  try {
    const data = await api.toiletsControllerGetRatingsByToilet(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;CreateToiletRatingDto&gt;**](CreateToiletRatingDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## toiletsControllerGetToiletById

> CreateToiletRatingDto toiletsControllerGetToiletById(id)

Получить туалет по ID с его отзывами

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ToiletsControllerGetToiletByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number
    id: 8.14,
  } satisfies ToiletsControllerGetToiletByIdRequest;

  try {
    const data = await api.toiletsControllerGetToiletById(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**CreateToiletRatingDto**](CreateToiletRatingDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

