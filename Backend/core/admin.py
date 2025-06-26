from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Feedback, User, Acknowledgment



# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')

    fieldsets = UserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role',)}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role Info', {'fields': ('role',)}),
    )
    
admin.site.register(User, CustomUserAdmin)
admin.site.register(Feedback)
admin.site.register(Acknowledgment)
