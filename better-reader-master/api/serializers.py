from rest_framework import serializers
from . import models


class UsersSerializer(serializers.ModelSerializer):
    """
    Currently unused in preference of the below.
    """
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = models.Users
        fields = ('id', 'username', 'email', 'password',
                  'first_name', 'last_name', 'current_reading_book', 'review', 'points', 'books_completed', 'description', 'profile_picture')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class ViewUsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Users
        fields = (
            "id",
            "email",
            'username',
            'first_name',
            'last_name',
            'current_reading_book',
            'review',
            "timestamp",
            'points', 'books_completed', 'description', 'profile_picture'
        )


class ViewCommentsSerializer(serializers.ModelSerializer):
    by_user = ViewUsersSerializer()

    class Meta:
        model = models.Comments
        fields = "__all__"


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Comments
        fields = "__all__"


class ViewRepliesSerializer(serializers.ModelSerializer):
    by_user = ViewUsersSerializer()

    class Meta:
        model = models.Replies
        fields = "__all__"


class RepliesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Replies
        fields = "__all__"


class ViewShelfsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Shelfs
        fields = "__all__"


class ShelfsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Shelfs
        fields = "__all__"


class ViewUserBooksSerializer(serializers.ModelSerializer):
    shelf = ViewShelfsSerializer()

    class Meta:
        model = models.UserBooks
        fields = "__all__"


class UserBooksSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserBooks
        fields = "__all__"


class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserProgress
        fields = "__all__"


class TrophiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Trophies
        fields = "__all__"


class UserTrophiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserTrophies
        fields = "__all__"


class ViewForumPostSerializer(serializers.ModelSerializer):
    user = ViewUsersSerializer()

    class Meta:
        model = models.ForumPost
        fields = "__all__"


class ForumPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ForumPost
        fields = "__all__"


class ViewForumPostRepliesSerializer(serializers.ModelSerializer):
    user = ViewUsersSerializer()

    class Meta:
        model = models.ForumPostReplies
        fields = "__all__"


class ForumPostRepliesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ForumPostReplies
        fields = "__all__"
