package main

import (
	"fmt"
	"log"
	"net/http"
)

type RouteConfig struct {
	URL  string
	Path map[string]string
}

func (rc *RouteConfig) guard(w http.ResponseWriter, r *http.Request) {
	currentPath := r.URL.Path
	id := r.URL.Query().Get("id")

	fmt.Printf("Пришел запрос: путь=%s, id=%s\n", currentPath, id)

	if id != "" {
		fullURL := fmt.Sprintf("%s/analytic/qr?id=%s", rc.URL, id)
		fmt.Printf("Редирект по ID: %s\n", fullURL)
		http.Redirect(w, r, fullURL, http.StatusFound)
		return
	}

	if newPath, exists := rc.Path[currentPath]; exists {
		fullURL := rc.URL + newPath
		http.Redirect(w, r, fullURL, http.StatusFound)
		return
	}

	http.NotFound(w, r)
}

func main() {
	config := &RouteConfig{
		URL: "http://localhost:4173",
		Path: map[string]string{
			"/old":     "/new",
			"analytic": "analytic",
		},
	}

	http.HandleFunc("/", config.guard)

	fmt.Println("Сервер запущен на http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8040", nil))
}

// https://fesmu.promotion-pal.ru/analytic/?id=7
