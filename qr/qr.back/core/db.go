package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitPostgres(host, port, user, password, dbname string) error {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	})

	if err != nil {
		return fmt.Errorf("ошибка подключения к PostgreSQL: %w", err)
	}

	log.Println("PostgreSQL подключена успешно")
	return nil
}

func Migrate(models ...interface{}) error {
	err := DB.AutoMigrate(models...)
	if err != nil {
		return fmt.Errorf("ошибка миграции: %w", err)
	}

	log.Println("Миграция выполнена успешно")
	return nil
}
