from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class Users(AbstractUser):
    timestamp = models.DateTimeField(auto_now_add=True)
    token = models.TextField(null=True, blank=True)
    email = models.EmailField(
        max_length=256, unique=True)
    current_reading_book = models.CharField(
        max_length=256, blank=True, null=True, default="")
    review = models.CharField(
        max_length=256, blank=True, null=True, default="")
    description = models.TextField(blank=True, null=True, default="")
    profile_picture = models.TextField(blank=True, null=True, default="")
    points = models.IntegerField(default=0, blank=True, null=True)
    books_completed = models.IntegerField(default=0, blank=True, null=True)

    class Meta:
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email


class Shelfs(models.Model):
    title = models.CharField(max_length=256)
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE, blank=True, null=True
    )
    is_global = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Shelfs"

    def __str__(self):
        return self.title


class UserBooks(models.Model):
    book = models.CharField(max_length=256)
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE
    )
    shelf = models.ForeignKey(
        Shelfs,
        on_delete=models.CASCADE
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "User Books"

    def __str__(self):
        return self.book


class UserProgress(models.Model):
    book = models.CharField(max_length=256)
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE
    )
    pages_read = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "User Progress"

    def __str__(self):
        return self.book


class Comments(models.Model):
    book = models.CharField(max_length=256)
    by_user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE
    )
    content = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Comments"

    def __str__(self):
        return self.content


class Replies(models.Model):
    comment = models.ForeignKey(
        Comments,
        on_delete=models.CASCADE
    )
    by_user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE
    )
    content = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Replies"

    def __str__(self):
        return self.content


class Trophies(models.Model):
    criteria = models.TextField()
    code = models.CharField(max_length=256)

    class Meta:
        verbose_name_plural = "Trophies"

    def __str__(self):
        return self.code


class UserTrophies(models.Model):
    tropy = models.ForeignKey(
        Trophies,
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name_plural = "User Trophies"


class ForumPost(models.Model):
    title = models.CharField(max_length=256)
    text = models.TextField(blank=True, null=True)
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE, blank=True, null=True
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Forum Post"

    def __str__(self):
        return self.title


class ForumPostReplies(models.Model):
    forum = models.ForeignKey(
        ForumPost,
        on_delete=models.CASCADE, blank=True, null=True
    )
    reply = models.TextField(blank=True, null=True)
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE, blank=True, null=True
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Forum Post Replies"

    def __str__(self):
        return self.reply
