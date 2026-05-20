package main

import (
	"fmt"
	"log"
	"net/http"

	database "applications-back/core"
	application_controller "applications-back/routes/controller"
	application_service "applications-back/routes/service"
)

var PORT int = 8080

func main() {
	log.Println("🚀 Запуск сервера...")

	db, err := database.NewDB()
	if err != nil {
		log.Printf("❌ Ошибка подключения к БД: %v", err)
		log.Println("⚠️ Сервер будет работать в МОК-режиме без БД")
		db = nil
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

	appService := application_service.NewApplicationService(db)
	handlerApplication := application_controller.NewApplicationHandler(appService)
	handlerApplication.RegisterRoutes(mux)

	log.Printf("🌐 Сервер запущен на порту %d\n", PORT)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", PORT), mux))
}
