package models

import "time"

type Application struct {
	ID uint `gorm:"primaryKey" json:"id"`

	Name        string `gorm:"size:100;not null" json:"name"`
	Description string `gorm:"type:text" json:"description"`
	Version     string `gorm:"size:20" json:"version"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (Application) TableName() string {
	return "applications"
}
