from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
        ROLE_CHOICES = [
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    ]
        role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='employee')
        manager = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        limit_choices_to={'role': 'manager'},
        related_name='team_members'
    )
        
        
class Feedback(models.Model):
    manager = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='feedback_given'
    )
    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='feedback_received'
    )
    strengths = models.TextField()
    improvements = models.TextField()
    
    SENTIMENT_CHOICES = [
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative'),
    ]
    
    sentiment = models.CharField(
        max_length=10,
        choices=SENTIMENT_CHOICES,
        default='neutral'
    )
    created_at = models.DateTimeField(auto_now_add=True)


class Acknowledgment(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name='acknowledgments')
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('feedback', 'employee')
