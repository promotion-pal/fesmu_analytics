package main

import (
	"fmt"
	"log"
	"net/http"

	database "user-back/core"
	_ "user-back/docs"
	"user-back/routes/controller"
	"user-back/routes/service"

	httpSwagger "github.com/swaggo/http-swagger"
)

var PORT int = 8080

func main() {
	log.Println("🚀 Запуск сервера...")

	db, err := database.NewDB()
	if err != nil {
		log.Printf("❌ Ошибка подключения к БД: %v", err)
		log.Println("⚠️ Сервер будет работать без БД")
		db = nil
	}

	if db != nil {
		defer func() {
			sqlDB, _ := db.DB()
			if sqlDB != nil {
				sqlDB.Close()
			}
			log.Println("🔒 Соединение с БД закрыто")
		}()
		log.Println("✅ База данных готова к работе")
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hello, back is alive!")
	})

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		status := "ok"
		dbStatus := "disconnected"
		if db != nil {
			dbStatus = "connected"
		}
		fmt.Fprintf(w, `{"status":"%s","database":"%s"}`, status, dbStatus)
	})

	mux.Handle("/docs/", httpSwagger.WrapHandler)

	userService := service.NewUserService(db)
	userHandler := controller.NewUserHandler(userService)
	userHandler.RegisterRoutes(mux)

	authService := service.NewAuthService(db)
	authHandler := controller.NewAuthHandler(authService, userService)
	authHandler.RegisterRoutes(mux)

	log.Printf("🌐 Сервер запущен на http://localhost:%d\n", PORT)
	log.Printf("📋 Доступные эндпоинты:")
	log.Printf("   GET    /users")
	log.Printf("   POST   /users")
	log.Printf("   GET    /users/{id}")
	log.Printf("   PUT    /users/{id}")
	log.Printf("   DELETE /users/{id}")
	log.Printf("   GET    /users/email/{email}")
	log.Printf("   PATCH  /users/{id}/role")

	log.Printf("   GET    /login")
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", PORT), mux))
}
