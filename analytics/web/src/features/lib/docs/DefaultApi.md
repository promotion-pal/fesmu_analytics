# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**lectureHallControllerAddRating**](DefaultApi.md#lecturehallcontrolleraddrating) | **POST** /lecture-hall/{id}/ratings | Добавить отзыв к лекционному залу |
| [**lectureHallControllerCreateLectureHall**](DefaultApi.md#lecturehallcontrollercreatelecturehall) | **POST** /lecture-hall | Создать новый лекционный зал |
| [**lectureHallControllerGetAllLectureHalls**](DefaultApi.md#lecturehallcontrollergetalllecturehalls) | **GET** /lecture-hall | Получить все лекционные залы с отзывами |
| [**lectureHallControllerGetAllRatings**](DefaultApi.md#lecturehallcontrollergetallratings) | **GET** /lecture-hall/ratings | Получить все отзывы о лекционных залах |
| [**lectureHallControllerGetLectureHallById**](DefaultApi.md#lecturehallcontrollergetlecturehallbyid) | **GET** /lecture-hall/{id} | Получить лекционный зал по ID с его отзывами |
| [**lectureHallControllerGetRatingsByLectureHall**](DefaultApi.md#lecturehallcontrollergetratingsbylecturehall) | **GET** /lecture-hall/{id}/ratings | Получить все отзывы конкретного лекционного зала |
| [**toiletsControllerAddRating**](DefaultApi.md#toiletscontrolleraddrating) | **POST** /toilets/{id}/ratings | Добавить отзыв к туалету |
| [**toiletsControllerCreateToilet**](DefaultApi.md#toiletscontrollercreatetoilet) | **POST** /toilets | Создать новый туалет |
| [**toiletsControllerGetAllRatings**](DefaultApi.md#toiletscontrollergetallratings) | **GET** /toilets/ratings | Получить все отзывы |
| [**toiletsControllerGetAllToilets**](DefaultApi.md#toiletscontrollergetalltoilets) | **GET** /toilets | Получить все туалеты с отзывами |
| [**toiletsControllerGetRatingsByToilet**](DefaultApi.md#toiletscontrollergetratingsbytoilet) | **GET** /toilets/{id}/ratings | Получить все отзывы конкретного туалета |
| [**toiletsControllerGetToiletById**](DefaultApi.md#toiletscontrollergettoiletbyid) | **GET** /toilets/{id} | Получить туалет по ID с его отзывами |



## lectureHallControllerAddRating

> LectureHallRatingResDto lectureHallControllerAddRating(id, lectureHallRatingCreateDto)

Добавить отзыв к лекционному залу

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { LectureHallControllerAddRatingRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number
    id: 8.14,
    // LectureHallRatingCreateDto
    lectureHallRatingCreateDto: ...,
  } satisfies LectureHallControllerAddRatingRequest;

  try {
    const data = await api.lectureHallControllerAddRating(body);
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
| **lectureHallRatingCreateDto** | [LectureHallRatingCreateDto](LectureHallRatingCreateDto.md) |  | |

### Return type

[**LectureHallRatingResDto**](LectureHallRatingResDto.md)

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


## lectureHallControllerCreateLectureHall

> LectureHallResDto lectureHallControllerCreateLectureHall(lectureHallCreateDto)

Создать новый лекционный зал

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { LectureHallControllerCreateLectureHallRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // LectureHallCreateDto
    lectureHallCreateDto: ...,
  } satisfies LectureHallControllerCreateLectureHallRequest;

  try {
    const data = await api.lectureHallControllerCreateLectureHall(body);
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
| **lectureHallCreateDto** | [LectureHallCreateDto](LectureHallCreateDto.md) |  | |

### Return type

[**LectureHallResDto**](LectureHallResDto.md)

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


## lectureHallControllerGetAllLectureHalls

> Array&lt;LectureHallResDto&gt; lectureHallControllerGetAllLectureHalls()

Получить все лекционные залы с отзывами

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { LectureHallControllerGetAllLectureHallsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.lectureHallControllerGetAllLectureHalls();
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

[**Array&lt;LectureHallResDto&gt;**](LectureHallResDto.md)

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


## lectureHallControllerGetAllRatings

> Array&lt;LectureHallRatingResDto&gt; lectureHallControllerGetAllRatings()

Получить все отзывы о лекционных залах

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { LectureHallControllerGetAllRatingsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.lectureHallControllerGetAllRatings();
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

[**Array&lt;LectureHallRatingResDto&gt;**](LectureHallRatingResDto.md)

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


## lectureHallControllerGetLectureHallById

> LectureHallResDto lectureHallControllerGetLectureHallById(id)

Получить лекционный зал по ID с его отзывами

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { LectureHallControllerGetLectureHallByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number
    id: 8.14,
  } satisfies LectureHallControllerGetLectureHallByIdRequest;

  try {
    const data = await api.lectureHallControllerGetLectureHallById(body);
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

[**LectureHallResDto**](LectureHallResDto.md)

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


## lectureHallControllerGetRatingsByLectureHall

> Array&lt;LectureHallRatingResDto&gt; lectureHallControllerGetRatingsByLectureHall(id)

Получить все отзывы конкретного лекционного зала

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { LectureHallControllerGetRatingsByLectureHallRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number
    id: 8.14,
  } satisfies LectureHallControllerGetRatingsByLectureHallRequest;

  try {
    const data = await api.lectureHallControllerGetRatingsByLectureHall(body);
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

[**Array&lt;LectureHallRatingResDto&gt;**](LectureHallRatingResDto.md)

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


## toiletsControllerAddRating

> ToiletRatingResDto toiletsControllerAddRating(id, toiletCreateRatingDto)

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
    // ToiletCreateRatingDto
    toiletCreateRatingDto: ...,
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
| **toiletCreateRatingDto** | [ToiletCreateRatingDto](ToiletCreateRatingDto.md) |  | |

### Return type

[**ToiletRatingResDto**](ToiletRatingResDto.md)

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

> ToiletResDto toiletsControllerCreateToilet(toiletCreateDto)

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
    // ToiletCreateDto
    toiletCreateDto: ...,
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
| **toiletCreateDto** | [ToiletCreateDto](ToiletCreateDto.md) |  | |

### Return type

[**ToiletResDto**](ToiletResDto.md)

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

> Array&lt;ToiletRatingResDto&gt; toiletsControllerGetAllRatings()

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

[**Array&lt;ToiletRatingResDto&gt;**](ToiletRatingResDto.md)

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

> Array&lt;ToiletResDto&gt; toiletsControllerGetAllToilets()

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

[**Array&lt;ToiletResDto&gt;**](ToiletResDto.md)

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

> Array&lt;ToiletRatingResDto&gt; toiletsControllerGetRatingsByToilet(id)

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

[**Array&lt;ToiletRatingResDto&gt;**](ToiletRatingResDto.md)

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

> ToiletResDto toiletsControllerGetToiletById(id)

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

[**ToiletResDto**](ToiletResDto.md)

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

