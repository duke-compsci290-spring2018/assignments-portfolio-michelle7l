from django.views import generic
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from .models import Album
from django.views.generic import View
from django.contrib.auth import authenticate, login, logout
from .forms import UserForm, LoginForm
from django.shortcuts import render, redirect

class IndexView(generic.ListView): #use listview to show a list of objects
    template_name = 'music/index.html'
    context_object_name='all_albums'
    
    def get_queryset(self):
        return Album.objects.all()
    
class MusicDetailView(generic.DetailView): #use detail view to show info of one object
    model = Album
    template_name = 'music/details.html'

class AlbumAdd(CreateView): #use create view to create an object
    model = Album
    fields = ['artist','albumTitle', 'genre', 'albumLogo']
    
class AlbumUpdate(UpdateView): #use update view to update an object
    model = Album
    fields = ['artist','albumTitle', 'genre', 'albumLogo']
    
class AlbumDelete(DeleteView): #use delete view to delete an object 
    model = Album
    success_url = reverse_lazy('music:index') #directs back to home page
    
class UserFormView(View):
    form_class= UserForm
    template_name = 'music/registration.html'
    
    def get(self,request): #get request just to view the form 
        form = self.form_class(None)
        # render(request,template name, context needed for template)
        return render(request, self.template_name, {'form':form})
        
    def post(self,request): #post request when a user submits the form
        form = self.form_class(request.POST)
        
        if form.is_valid():
            user = form.save(commit=False)
            
            #normalizes data
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            
            user.set_password(password)
            user.save()
            
            authuser = authenticate(username=username, password=password)
            
            #log in
            if authuser is not None:
                login(request, authuser)
                return redirect('music:index')
            else:
                raise forms.ValidationError('Please try again.')
        
        return render(request, self.template_name , {'form' : form})

def login_view(request):
    form = LoginForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        authuser = authenticate(username=username, password=password)
        login(request, authuser)
        return redirect('music:index')
    return render(request, 'music/login.html', {'form': form})
                    
def logout_view(request):
    logout(request)
    return redirect('music:index')
