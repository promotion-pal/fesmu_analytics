package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	models "applications-back/models"
)

func NewDB() (*gorm.DB, error) {
	host := os.Getenv("POSTGRES_HOST")
	if host == "" {
		host = "localhost"
	}

	user := os.Getenv("POSTGRES_USER")
	if user == "" {
		user = "root"
	}

	password := os.Getenv("POSTGRES_PASSWORD")
	if password == "" {
		password = "pass"
	}

	dbname := os.Getenv("POSTGRES_DB")
	if dbname == "" {
		dbname = "applications_db"
	}

	port := os.Getenv("POSTGRES_PORT")
	if port == "" {
		port = "5432"
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		host, user, password, dbname, port)

	log.Printf("🔌 Подключаемся к PostgreSQL: %s@%s:%s/%s", user, host, port, dbname)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("ошибка подключения: %w", err)
	}

	log.Println("✅ Подключение установлено")

	err = db.AutoMigrate(&models.Application{})
	if err != nil {
		return nil, fmt.Errorf("ошибка миграции: %w", err)
	}

	log.Println("✅ Таблица applications создана/проверена")

	return db, nil
}
