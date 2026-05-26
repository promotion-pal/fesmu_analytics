package models

import "time"

type UserRole string

const (
	RoleAdmin   = "admin"
	RoleGuest   = "guest"
	RoleWorker  = "worker"
	RoleStudent = "student"
)

type UserBase struct {
	FirstName  string `gorm:"size:100;not null" json:"first_name"`
	LastName   string `gorm:"size:100;not null" json:"last_name"`
	Patronymic string `gorm:"size:100" json:"patronymic"`
	Phone      string `gorm:"size:20" json:"phone"`

	Role     UserRole `gorm:"size:10;default:guest" json:"role"`
	Password string   `gorm:"size:255;not null" json:"-"`
}

type User struct {
	UserBase

	ID uint `gorm:"primaryKey" json:"id"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (User) TableName() string {
	return "users"
}
