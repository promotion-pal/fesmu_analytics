package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	database "qr-back/core"
	"qr-back/models"
	"qr-back/repository"

	_ "qr-back/docs"

	httpSwagger "github.com/swaggo/http-swagger"
)

var toiletRepo *repository.ToiletRepository

// @title           QR Toilet API
// @version         1.0
// @description     API для оценки состояния туалетов по QR кодам
// @host           localhost:8000
// @BasePath        /

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func main() {
	dbname := getEnv("POSTGRES_DB", "qr")
	port := getEnv("POSTGRES_PORT", "5432")
	user := getEnv("POSTGRES_USER", "postgres")
	host := getEnv("POSTGRES_HOST", "localhost")
	password := getEnv("POSTGRES_PASSWORD", "postgres")

	err := database.InitPostgres(host, port, user, password, dbname)
	if err != nil {
		log.Fatal("Ошибка подключения к БД:", err)
	}

	if err := database.Migrate(&models.Toilet{}, &models.ToiletRating{}); err != nil {
		log.Fatal("Ошибка миграции:", err)
	}

	toiletRepo = repository.NewToiletRepository()

	// ==================== TOILET ROUTES ====================
	http.HandleFunc("POST /api/toilets", createToilet)        // POST - создать туалет
	http.HandleFunc("GET /api/toilets", getAllToilets)        // GET - все туалеты
	http.HandleFunc("GET /api/toilets/{id}", getToiletByID)   // GET - туалет по ID
	http.HandleFunc("PUT /api/toilets/{id}", updateToilet)    // PUT - обновить туалет
	http.HandleFunc("DELETE /api/toilets/{id}", deleteToilet) // DELETE - удалить туалет

	// ==================== RATING ROUTES ====================
	http.HandleFunc("POST /api/toilets/{id}/ratings", addRating)         // POST - добавить оценку
	http.HandleFunc("GET /api/toilets/{id}/ratings", getRatingsByToilet) // GET - оценки туалета
	http.HandleFunc("GET /api/ratings", getAllRatings)                   // GET - все оценки
	http.HandleFunc("GET /api/ratings/{id}", getRatingByID)              // GET - оценка по ID
	http.HandleFunc("DELETE /api/ratings/{id}", deleteRating)            // DELETE - удалить оценку

	// Swagger
	http.HandleFunc("/swagger/", httpSwagger.Handler(
		httpSwagger.URL("http://localhost:8000/swagger/doc.json"),
	))

	PORT := 8000
	log.Printf("🚀 Сервер запущен на http://localhost:%d", PORT)
	log.Printf("📚 Swagger: http://localhost:%d/swagger/index.html", PORT)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", PORT), nil))
}

// ==================== TOILET HANDLERS ====================

// @Summary      Создать туалет
// @Tags         toilets
// @Accept       json
// @Produce      json
// @Param        toilet body      models.Toilet true "Данные туалета"
// @Success      201    {object}  models.Toilet
// @Failure      400    {object}  map[string]string
// @Router       /api/toilets [post]
func createToilet(w http.ResponseWriter, r *http.Request) {
	var toilet models.Toilet
	if err := json.NewDecoder(r.Body).Decode(&toilet); err != nil {
		http.Error(w, "Неверный запрос", http.StatusBadRequest)
		return
	}

	if err := toiletRepo.CreateToilet(&toilet); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(toilet)
}

// @Summary      Получить все туалеты
// @Tags         toilets
// @Produce      json
// @Success      200 {array}  models.Toilet
// @Router       /api/toilets [get]
func getAllToilets(w http.ResponseWriter, r *http.Request) {
	toilets, err := toiletRepo.GetAllToilets()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(toilets)
}

// @Summary      Получить туалет по ID
// @Tags         toilets
// @Produce      json
// @Param        id   path      int  true  "ID туалета"
// @Success      200  {object}  models.Toilet
// @Failure      404  {object}  map[string]string
// @Router       /api/toilets/{id} [get]
func getToiletByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, "Неверный ID", http.StatusBadRequest)
		return
	}

	toilet, err := toiletRepo.GetToiletByID(uint(id))
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(toilet)
}

// @Summary      Обновить туалет
// @Tags         toilets
// @Accept       json
// @Produce      json
// @Param        id      path      int                   true  "ID туалета"
// @Param        updates body      map[string]interface{} true  "Поля для обновления"
// @Success      200     {object}  models.Toilet
// @Failure      404     {object}  map[string]string
// @Router       /api/toilets/{id} [put]
func updateToilet(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, "Неверный ID", http.StatusBadRequest)
		return
	}

	var updates map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, "Неверный запрос", http.StatusBadRequest)
		return
	}

	toilet, err := toiletRepo.UpdateToilet(uint(id), updates)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(toilet)
}

// @Summary      Удалить туалет
// @Tags         toilets
// @Param        id   path      int  true  "ID туалета"
// @Success      204  "No Content"
// @Failure      404  {object}  map[string]string
// @Router       /api/toilets/{id} [delete]
func deleteToilet(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, "Неверный ID", http.StatusBadRequest)
		return
	}

	if err := toiletRepo.DeleteToilet(uint(id)); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// ==================== RATING HANDLERS ====================

// @Summary      Добавить оценку туалету
// @Tags         ratings
// @Accept       json
// @Produce      json
// @Param        id     path      int                true  "ID туалета"
// @Param        rating body      models.ToiletRating true  "Данные оценки"
// @Success      201    {object}  models.ToiletRating
// @Failure      400    {object}  map[string]string
// @Router       /api/toilets/{id}/ratings [post]
func addRating(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	toiletID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, "Неверный ID", http.StatusBadRequest)
		return
	}

	var rating models.ToiletRating
	if err := json.NewDecoder(r.Body).Decode(&rating); err != nil {
		http.Error(w, "Неверный запрос", http.StatusBadRequest)
		return
	}
	rating.ToiletID = uint(toiletID)

	if err := toiletRepo.AddRating(&rating); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(rating)
}

// @Summary      Получить все оценки туалета
// @Tags         ratings
// @Produce      json
// @Param        id   path      int  true  "ID туалета"
// @Success      200  {array}   models.ToiletRating
// @Router       /api/toilets/{id}/ratings [get]
func getRatingsByToilet(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	toiletID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, "Неверный ID", http.StatusBadRequest)
		return
	}

	ratings, err := toiletRepo.GetRatingsByToiletID(uint(toiletID))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ratings)
}

// @Summary      Получить все оценки (всех туалетов)
// @Tags         ratings
// @Produce      json
// @Success      200 {array}  models.ToiletRating
// @Router       /api/ratings [get]
func getAllRatings(w http.ResponseWriter, r *http.Request) {
	ratings, err := toiletRepo.GetAllRatings()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ratings)
}

// @Summary      Получить оценку по ID
// @Tags         ratings
// @Produce      json
// @Param        id   path      int  true  "ID оценки"
// @Success      200  {object}  models.ToiletRating
// @Failure      404  {object}  map[string]string
// @Router       /api/ratings/{id} [get]
func getRatingByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, "Неверный ID", http.StatusBadRequest)
		return
	}

	rating, err := toiletRepo.GetRatingByID(uint(id))
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(rating)
}

// @Summary      Удалить оценку
// @Tags         ratings
// @Param        id   path      int  true  "ID оценки"
// @Success      204  "No Content"
// @Failure      404  {object}  map[string]string
// @Router       /api/ratings/{id} [delete]
func deleteRating(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, "Неверный ID", http.StatusBadRequest)
		return
	}

	if err := toiletRepo.DeleteRating(uint(id)); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// package main

// import (
// 	"encoding/json"
// 	"fmt"
// 	"log"
// 	"net/http"
// 	"os"
// 	"strconv"

// 	database "qr-back/core"
// 	"qr-back/models"
// 	"qr-back/repository"

// 	_ "qr-back/docs"

// 	httpSwagger "github.com/swaggo/http-swagger"
// )

// var toiletRepo *repository.ToiletRepository

// // @title           QR Toilet API
// // @version         1.0
// // @description     API для оценки состояния туалетов по QR кодам
// // @host           localhost:8000
// // @BasePath		/

// func getEnv(key, defaultValue string) string {
// 	if value := os.Getenv(key); value != "" {
// 		return value
// 	}
// 	return defaultValue
// }

// func main() {
// 	dbname := getEnv("POSTGRES_DB", "qr")
// 	port := getEnv("POSTGRES_PORT", "5432")
// 	user := getEnv("POSTGRES_USER", "postgres")
// 	host := getEnv("POSTGRES_HOST", "localhost")
// 	password := getEnv("POSTGRES_PASSWORD", "postgres")

// 	err := database.InitPostgres(host, port, user, password, dbname)
// 	if err != nil {
// 		log.Fatal("Ошибка подключения к БД:", err)
// 	}

// 	if err := database.Migrate(&models.Toilet{}, &models.ToiletRating{}); err != nil {
// 		log.Fatal("Ошибка миграции:", err)
// 	}

// 	toiletRepo = repository.NewToiletRepository()

// 	// === ТОЛЬКО НУЖНЫЕ МАРШРУТЫ ===
// 	http.HandleFunc("GET /api/toilets", getToilets)              // список туалетов
// 	http.HandleFunc("GET /api/toilets/{id}/ratings", getRatings) // оценки туалета
// 	http.HandleFunc("POST /api/toilets/{id}/ratings", addRating) // добавить оценку

// 	// Swagger
// 	http.HandleFunc("/swagger/", httpSwagger.Handler(
// 		httpSwagger.URL("http://localhost:8000/swagger/doc.json"),
// 	))

// 	PORT := 8000
// 	log.Printf("🚀 Сервер запущен на http://localhost:%d", PORT)
// 	log.Printf("📚 Swagger: http://localhost:%d/swagger/index.html", PORT)
// 	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", PORT), nil))
// }

// // GET /api/toilets - список туалетов
// // @Summary      Получить список туалетов
// // @Tags         toilets
// // @Produce      json
// // @Success      200 {array}  models.Toilet
// // @Router       /api/toilets [get]
// func getToilets(w http.ResponseWriter, r *http.Request) {
// 	toilets, err := toiletRepo.GetAll()
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}
// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(toilets)
// }

// // GET /api/toilets/{id}/ratings - получить оценки туалета
// // @Summary      Получить оценки туалета
// // @Tags         ratings
// // @Produce      json
// // @Param        id   path      int  true  "ID туалета"
// // @Success      200  {array}   models.ToiletRating
// // @Router       /api/toilets/{id}/ratings [get]
// func getRatings(w http.ResponseWriter, r *http.Request) {
// 	idStr := r.PathValue("id")
// 	toiletID, err := strconv.ParseUint(idStr, 10, 32)
// 	if err != nil {
// 		http.Error(w, "Неверный ID", http.StatusBadRequest)
// 		return
// 	}

// 	ratings, err := toiletRepo.GetRatingsByToiletID(uint(toiletID))
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(ratings)
// }

// // POST /api/toilets/{id}/ratings - добавить оценку
// // @Summary      Добавить оценку туалету
// // @Tags         ratings
// // @Accept       json
// // @Produce      json
// // @Param        id     path      int                true  "ID туалета"
// // @Param        rating body      models.ToiletRating true  "Данные оценки"
// // @Success      201    {object}  models.ToiletRating
// // @Router       /api/toilets/{id}/ratings [post]
// func addRating(w http.ResponseWriter, r *http.Request) {
// 	idStr := r.PathValue("id")
// 	toiletID, err := strconv.ParseUint(idStr, 10, 32)
// 	if err != nil {
// 		http.Error(w, "Неверный ID", http.StatusBadRequest)
// 		return
// 	}

// 	var rating models.ToiletRating
// 	if err := json.NewDecoder(r.Body).Decode(&rating); err != nil {
// 		http.Error(w, "Неверный запрос", http.StatusBadRequest)
// 		return
// 	}
// 	rating.ToiletID = uint(toiletID)

// 	if err := toiletRepo.AddRating(&rating); err != nil {
// 		http.Error(w, err.Error(), http.StatusBadRequest)
// 		return
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(rating)
// }

// // package main

// // import (
// // 	"encoding/json"
// // 	"fmt"
// // 	"log"
// // 	"net/http"
// // 	"os"
// // 	"strconv"

// // 	database "qr-back/core"
// // 	"qr-back/models"
// // 	"qr-back/repository"

// // 	_ "qr-back/docs"

// // 	httpSwagger "github.com/swaggo/http-swagger"
// // )

// // var toiletRepo *repository.ToiletRepository

// // // @title           QR Toilet API
// // // @version         1.0
// // // @description     API для оценки состояния туалетов по QR кодам
// // // @termsOfService  http://swagger.io/terms/

// // // @contact.name   API Support
// // // @contact.email  support@qr-toilet.com

// // // @license.name   MIT
// // // @license.url    https://opensource.org/licenses/MIT

// // // @host           localhost:8000
// // // @BasePath       /api

// // func getEnv(key, defaultValue string) string {
// // 	if value := os.Getenv(key); value != "" {
// // 		return value
// // 	}
// // 	return defaultValue
// // }

// // func main() {
// // 	dbname := getEnv("POSTGRES_DB", "qr")
// // 	port := getEnv("POSTGRES_PORT", "5432")
// // 	user := getEnv("POSTGRES_USER", "postgres")
// // 	host := getEnv("POSTGRES_HOST", "localhost")
// // 	password := getEnv("POSTGRES_PASSWORD", "postgres")

// // 	err := database.InitPostgres(host, port, user, password, dbname)
// // 	if err != nil {
// // 		log.Fatal("Ошибка подключения к БД:", err)
// // 	}

// // 	if err := database.Migrate(&models.Toilet{}, &models.ToiletRating{}); err != nil {
// // 		log.Fatal("Ошибка миграции:", err)
// // 	}

// // 	toiletRepo = repository.NewToiletRepository()

// // 	// Только нужные маршруты
// // 	http.HandleFunc("GET /api/toilets", getToilets)                         // получить все туалеты
// // 	http.HandleFunc("POST /api/toilets/{id}/ratings", addRating)            // добавить оценку
// // 	http.HandleFunc("GET /api/toilets/{id}/ratings", getRatings)            // получить оценки туалета
// // 	http.HandleFunc("DELETE /api/toilets/ratings/{ratingId}", deleteRating) // удалить оценку

// // 	// Swagger документация
// // 	http.HandleFunc("/swagger/", httpSwagger.Handler(
// // 		httpSwagger.URL("http://localhost:8000/swagger/doc.json"),
// // 	))

// // 	PORT := 8000
// // 	log.Printf("🚀 Сервер запущен на http://localhost:%d", PORT)
// // 	log.Printf("📚 Swagger документация: http://localhost:%d/swagger/index.html", PORT)
// // 	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", PORT), nil))
// // }

// // // @Summary      Получить список всех туалетов
// // // @Description  Возвращает массив всех туалетов
// // // @Tags         toilets
// // // @Produce      json
// // // @Success      200 {array}  models.Toilet
// // // @Failure      500 {object} map[string]string
// // // @Router       /api/toilets [get]
// // func getToilets(w http.ResponseWriter, r *http.Request) {
// // 	toilets, err := toiletRepo.GetAll()
// // 	if err != nil {
// // 		http.Error(w, err.Error(), http.StatusInternalServerError)
// // 		return
// // 	}
// // 	w.Header().Set("Content-Type", "application/json")
// // 	json.NewEncoder(w).Encode(toilets)
// // }

// // // @Summary      Получить все оценки туалета
// // // @Description  Возвращает все оценки для указанного туалета
// // // @Tags         ratings
// // // @Produce      json
// // // @Param        id   path      int  true  "ID туалета"
// // // @Success      200  {array}   models.ToiletRating
// // // @Failure      404  {object}  map[string]string
// // // @Router       /api/toilets/{id}/ratings [get]
// // func getRatings(w http.ResponseWriter, r *http.Request) {
// // 	idStr := r.PathValue("id")
// // 	toiletID, err := strconv.ParseUint(idStr, 10, 32)
// // 	if err != nil {
// // 		http.Error(w, "Неверный ID туалета", http.StatusBadRequest)
// // 		return
// // 	}

// // 	// Проверяем, существует ли туалет
// // 	_, err = toiletRepo.GetByID(uint(toiletID))
// // 	if err != nil {
// // 		http.Error(w, "Туалет не найден", http.StatusNotFound)
// // 		return
// // 	}

// // 	ratings, err := toiletRepo.GetRatingsByToiletID(uint(toiletID))
// // 	if err != nil {
// // 		http.Error(w, err.Error(), http.StatusInternalServerError)
// // 		return
// // 	}

// // 	w.Header().Set("Content-Type", "application/json")
// // 	json.NewEncoder(w).Encode(ratings)
// // }

// // // @Summary      Добавить оценку туалету
// // // @Description  Добавляет новую оценку для указанного туалета
// // // @Tags         ratings
// // // @Accept       json
// // // @Produce      json
// // // @Param        id     path      int                true  "ID туалета"
// // // @Param        rating body      models.ToiletRating true  "Данные оценки"
// // // @Success      201    {object}  models.ToiletRating
// // // @Failure      400    {object}  map[string]string
// // // @Failure      404    {object}  map[string]string
// // // @Router       /api/toilets/{id}/ratings [post]
// // func addRating(w http.ResponseWriter, r *http.Request) {
// // 	idStr := r.PathValue("id")
// // 	toiletID, err := strconv.ParseUint(idStr, 10, 32)
// // 	if err != nil {
// // 		http.Error(w, "Неверный ID туалета", http.StatusBadRequest)
// // 		return
// // 	}

// // 	var rating models.ToiletRating
// // 	if err := json.NewDecoder(r.Body).Decode(&rating); err != nil {
// // 		http.Error(w, "Неверный запрос", http.StatusBadRequest)
// // 		return
// // 	}
// // 	rating.ToiletID = uint(toiletID)

// // 	if err := toiletRepo.AddRating(&rating); err != nil {
// // 		http.Error(w, err.Error(), http.StatusBadRequest)
// // 		return
// // 	}

// // 	w.Header().Set("Content-Type", "application/json")
// // 	w.WriteHeader(http.StatusCreated)
// // 	json.NewEncoder(w).Encode(rating)
// // }

// // // @Summary      Удалить оценку
// // // @Description  Удаляет оценку по ID
// // // @Tags         ratings
// // // @Param        ratingId   path      int  true  "ID оценки"
// // // @Success      204  "No Content"
// // // @Failure      404  {object}  map[string]string
// // // @Router       /api/toilets/ratings/{ratingId} [delete]
// // func deleteRating(w http.ResponseWriter, r *http.Request) {
// // 	ratingIdStr := r.PathValue("ratingId")
// // 	ratingID, err := strconv.ParseUint(ratingIdStr, 10, 32)
// // 	if err != nil {
// // 		http.Error(w, "Неверный ID оценки", http.StatusBadRequest)
// // 		return
// // 	}

// // 	if err := toiletRepo.DeleteRating(uint(ratingID)); err != nil {
// // 		http.Error(w, err.Error(), http.StatusNotFound)
// // 		return
// // 	}

// // 	w.WriteHeader(http.StatusNoContent)
// // }

// // // package main

// // // import (
// // // 	"encoding/json"
// // // 	"fmt"
// // // 	"log"
// // // 	"net/http"
// // // 	"os"
// // // 	"strconv"

// // // 	database "qr-back/core"
// // // 	"qr-back/models"
// // // 	"qr-back/repository"

// // // 	_ "qr-back/docs"

// // // 	httpSwagger "github.com/swaggo/http-swagger"
// // // )

// // // var toiletRepo *repository.ToiletRepository

// // // // @title           QR Toilet API
// // // // @version         1.0
// // // // @description     API для оценки состояния туалетов по QR кодам
// // // // @termsOfService  http://swagger.io/terms/

// // // // @contact.name   API Support
// // // // @contact.email  support@qr-toilet.com

// // // // @license.name   MIT
// // // // @license.url    https://opensource.org/licenses/MIT

// // // // @host           localhost:8000
// // // // @BasePath       /api

// // // func getEnv(key, defaultValue string) string {
// // // 	if value := os.Getenv(key); value != "" {
// // // 		return value
// // // 	}
// // // 	return defaultValue
// // // }

// // // func test(w http.ResponseWriter, r *http.Request) {
// // // 	json.NewEncoder(w).Encode(map[string]string{
// // // 		"status": "ok",
// // // 	})
// // // }

// // // func main() {
// // // 	dbname := getEnv("POSTGRES_DB", "qr")
// // // 	port := getEnv("POSTGRES_PORT", "5432")
// // // 	user := getEnv("POSTGRES_USER", "postgres")
// // // 	host := getEnv("POSTGRES_HOST", "localhost")
// // // 	password := getEnv("POSTGRES_PASSWORD", "postgres")

// // // 	err := database.InitPostgres(host, port, user, password, dbname)
// // // 	if err != nil {
// // // 		log.Fatal("Ошибка подключения к БД:", err)
// // // 	}

// // // 	if err := database.Migrate(&models.Toilet{}, &models.ToiletRating{}); err != nil {
// // // 		log.Fatal("Ошибка миграции:", err)
// // // 	}

// // // 	toiletRepo = repository.NewToiletRepository()

// // // 	// API маршруты
// // // 	http.HandleFunc("GET /api/toilets", getToilets)
// // // 	http.HandleFunc("GET /api/toilets/{id}", getToiletByID)
// // // 	http.HandleFunc("POST /api/toilets", createToilet)
// // // 	http.HandleFunc("PUT /api/toilets/{id}", updateToilet)
// // // 	http.HandleFunc("DELETE /api/toilets/{id}", deleteToilet)

// // // 	// Health check
// // // 	http.HandleFunc("/", test)

// // // 	// Swagger документация
// // // 	http.HandleFunc("/swagger/", httpSwagger.Handler(
// // // 		httpSwagger.URL("http://localhost:8000/swagger/doc.json"),
// // // 	))

// // // 	PORT := 8000
// // // 	log.Printf("🚀 Сервер запущен на http://localhost:%d", PORT)
// // // 	log.Printf("📚 Swagger документация: http://localhost:%d/swagger/index.html", PORT)
// // // 	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", PORT), nil))
// // // }

// // // // @Summary      Получить список всех туалетов
// // // // @Description  Возвращает массив всех туалетов, отсортированных по рейтингу
// // // // @Tags         toilets
// // // // @Produce      json
// // // // @Success      200 {array}  models.Toilet
// // // // @Failure      500 {object} map[string]string
// // // // @Router       /api/toilets [get]
// // // func getToilets(w http.ResponseWriter, r *http.Request) {
// // // 	toilets, err := toiletRepo.GetAll()
// // // 	if err != nil {
// // // 		http.Error(w, err.Error(), http.StatusInternalServerError)
// // // 		return
// // // 	}
// // // 	w.Header().Set("Content-Type", "application/json")
// // // 	json.NewEncoder(w).Encode(toilets)
// // // }

// // // // @Summary      Получить туалет по ID
// // // // @Description  Возвращает информацию о туалете по его ID
// // // // @Tags         toilets
// // // // @Produce      json
// // // // @Param        id   path      int  true  "ID туалета"
// // // // @Success      200  {object}  models.Toilet
// // // // @Failure      400  {object}  map[string]string
// // // // @Failure      404  {object}  map[string]string
// // // // @Router       /api/toilets/{id} [get]
// // // func getToiletByID(w http.ResponseWriter, r *http.Request) {
// // // 	idStr := r.PathValue("id")
// // // 	id, err := strconv.ParseUint(idStr, 10, 32)
// // // 	if err != nil {
// // // 		http.Error(w, "Неверный ID", http.StatusBadRequest)
// // // 		return
// // // 	}

// // // 	toilet, err := toiletRepo.GetByID(uint(id))
// // // 	if err != nil {
// // // 		http.Error(w, err.Error(), http.StatusNotFound)
// // // 		return
// // // 	}

// // // 	w.Header().Set("Content-Type", "application/json")
// // // 	json.NewEncoder(w).Encode(toilet)
// // // }

// // // // @Summary      Создать новый туалет
// // // // @Description  Добавляет новый туалет в базу данных
// // // // @Tags         toilets
// // // // @Accept       json
// // // // @Produce      json
// // // // @Param        toilet body      models.Toilet true "Данные туалета"
// // // // @Success      201    {object}  models.Toilet
// // // // @Failure      400    {object}  map[string]string
// // // // @Router       /api/toilets [post]
// // // func createToilet(w http.ResponseWriter, r *http.Request) {
// // // 	var toilet models.Toilet
// // // 	if err := json.NewDecoder(r.Body).Decode(&toilet); err != nil {
// // // 		http.Error(w, "Неверный запрос", http.StatusBadRequest)
// // // 		return
// // // 	}

// // // 	if err := toiletRepo.Create(&toilet); err != nil {
// // // 		http.Error(w, err.Error(), http.StatusBadRequest)
// // // 		return
// // // 	}

// // // 	w.Header().Set("Content-Type", "application/json")
// // // 	w.WriteHeader(http.StatusCreated)
// // // 	json.NewEncoder(w).Encode(toilet)
// // // }

// // // // @Summary      Обновить туалет
// // // // @Description  Обновляет информацию о туалете по ID
// // // // @Tags         toilets
// // // // @Accept       json
// // // // @Produce      json
// // // // @Param        id      path      int                   true "ID туалета"
// // // // @Param        updates body      map[string]interface{} true "Поля для обновления (is_clean, soap, name и т.д.)"
// // // // @Success      200     {object}  models.Toilet
// // // // @Failure      400     {object}  map[string]string
// // // // @Failure      404     {object}  map[string]string
// // // // @Router       /api/toilets/{id} [put]
// // // func updateToilet(w http.ResponseWriter, r *http.Request) {
// // // 	idStr := r.PathValue("id")
// // // 	id, err := strconv.ParseUint(idStr, 10, 32)
// // // 	if err != nil {
// // // 		http.Error(w, "Неверный ID", http.StatusBadRequest)
// // // 		return
// // // 	}

// // // 	var updates map[string]interface{}
// // // 	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
// // // 		http.Error(w, "Неверный запрос", http.StatusBadRequest)
// // // 		return
// // // 	}

// // // 	toilet, err := toiletRepo.Update(uint(id), updates)
// // // 	if err != nil {
// // // 		http.Error(w, err.Error(), http.StatusNotFound)
// // // 		return
// // // 	}

// // // 	w.Header().Set("Content-Type", "application/json")
// // // 	json.NewEncoder(w).Encode(toilet)
// // // }

// // // // @Summary      Удалить туалет
// // // // @Description  Удаляет туалет по ID (мягкое удаление)
// // // // @Tags         toilets
// // // // @Param        id   path      int  true  "ID туалета"
// // // // @Success      204  "No Content"
// // // // @Failure      400  {object}  map[string]string
// // // // @Failure      404  {object}  map[string]string
// // // // @Router       /api/toilets/{id} [delete]
// // // func deleteToilet(w http.ResponseWriter, r *http.Request) {
// // // 	idStr := r.PathValue("id")
// // // 	id, err := strconv.ParseUint(idStr, 10, 32)
// // // 	if err != nil {
// // // 		http.Error(w, "Неверный ID", http.StatusBadRequest)
// // // 		return
// // // 	}

// // // 	if err := toiletRepo.Delete(uint(id)); err != nil {
// // // 		http.Error(w, err.Error(), http.StatusNotFound)
// // // 		return
// // // 	}

// // // 	w.WriteHeader(http.StatusNoContent)
// // // }

// // // // @Summary      Добавить оценку туалету
// // // // @Description  Добавляет новую оценку для указанного туалета
// // // // @Tags         ratings
// // // // @Accept       json
// // // // @Produce      json
// // // // @Param        id     path      int                true  "ID туалета"
// // // // @Param        rating body      models.ToiletRating true  "Данные оценки"
// // // // @Success      201    {object}  models.ToiletRating
// // // // @Failure      400    {object}  map[string]string
// // // // @Failure      404    {object}  map[string]string
// // // // @Router       /api/toilets/{id}/ratings [post]
// // // func addRating(w http.ResponseWriter, r *http.Request) {
// // // 	idStr := r.PathValue("id")
// // // 	toiletID, err := strconv.ParseUint(idStr, 10, 32)
// // // 	if err != nil {
// // // 		http.Error(w, "Неверный ID туалета", http.StatusBadRequest)
// // // 		return
// // // 	}

// // // 	var rating models.ToiletRating
// // // 	if err := json.NewDecoder(r.Body).Decode(&rating); err != nil {
// // // 		http.Error(w, "Неверный запрос", http.StatusBadRequest)
// // // 		return
// // // 	}
// // // 	rating.ToiletID = uint(toiletID)

// // // 	if err := toiletRepo.AddRating(&rating); err != nil {
// // // 		http.Error(w, err.Error(), http.StatusBadRequest)
// // // 		return
// // // 	}

// // // 	w.Header().Set("Content-Type", "application/json")
// // // 	w.WriteHeader(http.StatusCreated)
// // // 	json.NewEncoder(w).Encode(rating)
// // // }
