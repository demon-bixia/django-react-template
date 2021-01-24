from django.shortcuts import render
from django.views.generic import TemplateView


class InterfaceView(TemplateView):
    template_name = 'index.html'
