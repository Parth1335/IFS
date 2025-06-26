from django.urls import path
from .views import FeedbackCreateView, FeedbackView, AckView, FeedbackUpdateView, ProfileView

urlpatterns = [
    path("feedback/", FeedbackView.as_view(), name="feedback-list"),   # GET
    path("feedback/create/", FeedbackCreateView.as_view(), name="feedback-create"),  # POST
    path('ack/', AckView.as_view(), name='acknowledge-feedback'),
    path('feedback/<int:pk>/', FeedbackUpdateView.as_view(), name='feedback-update'),
    path("profile/", ProfileView.as_view(), name="user-profile"),
]