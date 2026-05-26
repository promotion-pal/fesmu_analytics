package models

import "time"

type ApplicationStatus string

const (
	StatusPending  = "pending"
	StatusApproved = "approved"
	StatusRejected = "rejected"
)

type ApplicationCategory string

const (
	CategoryPlumber     ApplicationCategory = "plumber"
	CategoryCarpenter   ApplicationCategory = "carpenter"
	CategoryElectrician ApplicationCategory = "electrician"
)

type ApplicationBase struct {
	Name        string              `gorm:"size:100;not null" json:"name" binding:"required"`
	Description string              `gorm:"type:text" json:"description" binding:"required"`
	Category    ApplicationCategory `gorm:"size:30;not null" json:"category" binding:"required"`
}

type ApplicationEntity struct {
	ApplicationBase

	ID     int  `gorm:"primaryKey" json:"id"`
	UserID uint `gorm:"not null;index" json:"user_id"`

	Status ApplicationStatus `gorm:"size:20;default:pending" json:"status"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (ApplicationEntity) TableName() string {
	return "applications"
}
