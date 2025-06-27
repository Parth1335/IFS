from rest_framework import serializers
from .models import User, Feedback, Acknowledgment

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'password']
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user    

class FeedbackSerializer(serializers.ModelSerializer):
    manager = UserSerializer(read_only=True)
    employee = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='employee'))
    acknowledged = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ['id', 'manager', 'employee', 'strengths', 'improvements', 'sentiment', 'created_at', 'acknowledged']
    def get_acknowledged(self, obj):
     user = self.context['request'].user
    
     if user.role != 'employee':
         return Acknowledgment.objects.filter(feedback=obj, employee=obj.employee).exists()
     return Acknowledgment.objects.filter(feedback=obj, employee=user).exists()
     
class AcknowledgmentSerializer(serializers.ModelSerializer):
    employee = UserSerializer(read_only=True)
    feedback = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Acknowledgment
        fields = ['id', 'feedback', 'employee', 'timestamp']
        
def validate_employee(self, value):
    request = self.context['request']
    if request.user.role == 'manager' and value.manager != request.user:
        raise serializers.ValidationError("You can only select your team members.")
    return value        