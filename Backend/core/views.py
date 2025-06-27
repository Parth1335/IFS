from django.shortcuts import render
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Feedback, Acknowledgment
from .serializers import FeedbackSerializer, AcknowledgmentSerializer, UserSerializer
from rest_framework import status
from .permissions import IsManager, IsEmployee, IsOwnerManager
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied


class FeedbackCreateView(CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated, IsManager]

    def perform_create(self, serializer):
        employee = serializer.validated_data['employee']
        if employee.manager != self.request.user:
            raise PermissionDenied("You can only give feedback to your own team members.")
        serializer.save(manager=self.request.user)


class FeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == 'manager':
            # Manager sees feedbacks they wrote for their team only
            feedbacks = Feedback.objects.filter(manager=user, employee__manager=user)
        elif user.role == 'employee':
            feedbacks = Feedback.objects.filter(employee=user)
        else:
            return Response({'detail': 'Unauthorized role'}, status=403)

        serializer = FeedbackSerializer(feedbacks, many=True, context={'request': request})
        return Response(serializer.data)
    
class AckView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]

    def post(self, request):
        feedback_id = request.data.get('feedback')

        if not feedback_id:
            return Response({"detail": "Feedback ID is required."}, status=400)

        try:
            feedback = Feedback.objects.get(id=feedback_id)
        except Feedback.DoesNotExist:
            return Response({"detail": "Feedback not found."}, status=404)

        if feedback.employee != request.user:
            return Response({"detail": "You are not allowed to acknowledge this feedback."}, status=403)

        if Acknowledgment.objects.filter(feedback=feedback, employee=request.user).exists():
            return Response({"detail": "Feedback already acknowledged."}, status=400)

        Acknowledgment.objects.create(feedback=feedback, employee=request.user)
        return Response({"detail": "Feedback acknowledged successfully."}, status=201)
    
    
class FeedbackUpdateView(RetrieveUpdateAPIView):   
      queryset = Feedback.objects.all()
      serializer_class = FeedbackSerializer
      permission_classes = [IsAuthenticated, IsOwnerManager]
     
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class TeamMembersView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        team = request.user.team_members.filter(role='employee')
        serializer = UserSerializer(team, many=True)
        return Response(serializer.data)