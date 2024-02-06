from django.urls import path, re_path
from . import views

urlpatterns = [
    path('validate', views.validate, name='validate'),
    re_path(r'^user/(?P<pk>[0-9]+)$', views.user),
    path('user', views.user, name='user'),
    re_path(r'^comment/(?P<pk>[\w-]+)$', views.comment),
    path('comment', views.comment, name='comment'),
    re_path(r'^reply/(?P<pk>[\w-]+)$', views.reply),
    path('reply', views.reply, name='reply'),
    path("reset", views.reset, name="reset"),
    re_path(r'^search_books/(?P<pk>[\w-]+)$', views.search_books),
    path('search_books', views.search_books, name='search_books'),
    re_path(r'^shelf/(?P<pk>[\w-]+)$', views.shelf),
    path('shelf', views.shelf, name='shelf'),
    re_path(r'^userbooks/(?P<pk>[\w-]+)$', views.userbooks),
    path('userbooks', views.userbooks, name='userbooks'),
    re_path(r'^userprogress/(?P<pk>[\w-]+)$', views.userprogress),
    path('userprogress', views.userprogress, name='userprogress'),
    re_path(r'^usertrophies/(?P<pk>[\w-]+)$', views.usertrophies),
    path('usertrophies', views.usertrophies, name='usertrophies'),
    re_path(r'^update_info/(?P<pk>[\w-]+)$', views.update_info),
    path('update_info', views.update_info, name='update_info'),
    re_path(r'^forumpost/(?P<pk>[\w-]+)$', views.forumpost),
    path('forumpost', views.forumpost, name='forumpost'),
    re_path(r'^forumpostreplies/(?P<pk>[\w-]+)$', views.forumpostreplies),
    path('forumpostreplies', views.forumpostreplies, name='forumpostreplies'),
]
