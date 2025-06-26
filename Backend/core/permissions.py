from rest_framework.permissions import BasePermission

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'manager'

class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'employee'
    
class IsOwnerManager(BasePermission):
    def has_object_permission(self, request, view, obj):
       return request.user.is_authenticated and obj.manager == request.user    
    
