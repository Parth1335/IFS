from django.urls import path
from .views import FeedbackCreateView, FeedbackView, AckView, FeedbackUpdateView, ProfileView, CreateUserView, TeamMembersView, UpdateUserView  

urlpatterns = [
    path("feedback/", FeedbackView.as_view(), name="feedback-list"),   # GET
    path("feedback/create/", FeedbackCreateView.as_view(), name="feedback-create"),  # POST
    path('ack/', AckView.as_view(), name='acknowledge-feedback'),
    path('feedback/<int:pk>/', FeedbackUpdateView.as_view(), name='feedback-update'),
    path("profile/", ProfileView.as_view(), name="user-profile"),
    path('feedbacks/create/', FeedbackCreateView.as_view(), name='create-feedback'),
    path('feedbacks/', FeedbackView.as_view(), name='feedbacks'),
    path('feedbacks/<int:pk>/', FeedbackUpdateView.as_view(), name='update-feedback'),
    path('users/create/', CreateUserView.as_view(), name='create-user'),
    path("team/", TeamMembersView.as_view(), name="team-members"),
    path('users/<int:pk>/', UpdateUserView.as_view(), name='user-update-delete'),
]
