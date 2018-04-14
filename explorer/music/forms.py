from django import forms
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout, get_user_model


class LoginForm(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput())
    username = forms.CharField()
    
    class Meta:
        model = User #userform class associated with user model, django will render a html form for all fields associated with the user model
        fields = ('username', 'password')
        
    def clean(self, *args, **kwargs):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise forms.ValidationError("User does not exist.")
            if not user.is_active:
                raise forms.ValidationError("User is no longer active.")
            if not user.check_password(password):
                raise forms.ValidationError("Incorrect Password.")
        return super(LoginForm, self).clean(*args, **kwargs) #returns the default
    
    
class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User #userform class associated with user model, django will render a html form for all fields associated with the user model
        fields = ('username', 'email', 'password')