from django.urls import re_path,path
from . import views
from django.contrib.auth.views import logout

app_name = 'music'
urlpatterns = [
    # /music/
    path('', views.IndexView.as_view() , name='index'), #defalt home page 
    
    # /music/ID
    path('<int:pk>/', views.MusicDetailView.as_view() , name='detail'),
    
    # /music/album/add/
    path('album/add/',views.AlbumAdd.as_view(), name='album-add'),
    
    # /music/song/add/
    path('album/song/',views.AlbumAdd.as_view(), name='album-add'),
    
    # /music/album/ID
    path('album/<int:pk>/',views.AlbumUpdate.as_view(), name='album-update'),
    
    # /music/album/ID/delete
    path('album/<int:pk>/delete/',views.AlbumDelete.as_view(), name='album-delete'),
    
    # /music/register/
    path('register/', views.UserFormView.as_view() , name='register'),
    
    # /music/logout/
    path('logout/', views.logout_view , name='logout'),
    
    # /music/login/
    path('login/', views.login_view , name='login'),
    
]