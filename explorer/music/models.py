from django.db import models
from django.urls import reverse

# Create your models here.
class Album(models.Model):
    artist = models.CharField(max_length=300) #artist name will be text
    albumTitle = models.CharField(max_length=500)
    genre = models.CharField(max_length=100)
    albumLogo = models.CharField(max_length=2000) 
#Django will create primary keys for each album created
    
    def get_absolute_url(self):
        return reverse('music:detail', kwargs={'pk':self.pk})
    
class Song(models.Model):
    album = models.ForeignKey(Album, on_delete=models.CASCADE) #associates song with album
    fileType = models.CharField(max_length=10) 
    songTitle = models.CharField(max_length=250)
