import base64
from rest_framework import status
from . import serializers
from . import models
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from django.db.models import Sum
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password, check_password
from .helpers import send_forget_password_mail
from googleapiclient.discovery import build
from django.conf import settings
from django.utils import timezone

api_key = settings.GOOGLE_BOOKS_API_KEY
service = build('books', 'v1', developerKey=api_key)


def add_admin():
    try:
        models.Users.objects.get(email="admin@gmail.com")
    except Exception as e:
        user = models.Users()
        user.email = "admin@gmail.com"
        user.password = make_password("admin")
        user.username = "admin"
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print("ADMIN ADDED")
        add_global_shelfs()
        add_global_trophies()


def add_global_shelfs():
    data = [{
        "title": "Books Read",
    }, {
        "title": "Books to Read",
    }]
    for one in data:
        try:
            models.Shelfs.objects.get(title=one["title"])
        except Exception as e:
            shelf = models.Shelfs()
            shelf.title = one["title"]
            shelf.user = models.Users.objects.get(email="admin@gmail.com")
            shelf.is_global = True
            shelf.save()
    print("SHELFS ADDED")


def add_global_trophies():
    data = [{
        "criteria": "Read one book.",
        "code": "r1b",
    }, {
        "criteria": "Read 10 books.",
        "code": "r10b",
    }, {
        "criteria": "Read 100 books.",
        "code": "r100b",
    }, {
        "criteria": "Read 100 pages.",
        "code": "r100p",
    }, {
        "criteria": "Read 1000 pages.",
        "code": "r1000p",
    }, {
        "criteria": "Read 10000 pages.",
        "code": "r10000p",
    }, {
        "criteria": "Review a book.",
        "code": "review",
    }, {
        "criteria": "Read over 100 pages in one go.",
        "code": "r100go",
    }, {
        "criteria": "Read for 7 days in a row.",
        "code": "r7d",
    }, {
        "criteria": "Ultimate trophy gained by completing all other trophies.",
        "code": "ultimate",
    },]
    for one in data:
        try:
            models.Trophies.objects.get(code=one["code"])
        except Exception as e:
            trophy = models.Trophies()
            trophy.criteria = one["criteria"]
            trophy.code = one["code"]
            trophy.save()
    print("TROPHIES ADDED")


add_admin()


def assign_tropy(code, user_id):
    try:
        models.UserTrophies.objects.get(user__id=user_id, tropy__code=code)
    except Exception as e:
        assign = models.UserTrophies()
        assign.user = models.Users.objects.get(pk=int(user_id))
        assign.tropy = models.Trophies.objects.get(code=code)
        assign.save()


@api_view(['POST'])
def validate(request):
    if request.method == "POST":
        # VALIDATE A USER
        data = JSONParser().parse(request)
        Users = models.Users.objects.all()
        username = data["username"]
        password = data["password"]
        if username and password is not None:
            count = Users.filter(username=username).count()
            if count != 0:
                data = Users.filter(username=username).values(
                    'password').first()
                if check_password(password, data["password"]) or password == data["password"]:
                    userData = Users.filter(username=username).first()
                    SerializedData = serializers.ViewUsersSerializer(
                        userData, many=False)
                    return JsonResponse(SerializedData.data, safe=False)
                else:
                    return JsonResponse({'message': 'Incorrect password'}, safe=False)
            else:
                return JsonResponse({'message': 'No account associated with this email'}, status=status.HTTP_200_OK)
        return JsonResponse({'message': 'empty'}, status=status.HTTP_200_OK)


@api_view(['POST', 'PUT', 'GET'])
def user(request, pk=None):
    if request.method == "GET":
        # GET A USER BY ID
        if pk is None:
            return JsonResponse({"message": "No user id given"}, safe=False)
        instance = models.Users.objects.get(pk=int(pk))
        object = serializers.ViewUsersSerializer(instance, many=False)
        return JsonResponse(object.data, safe=False)
    if request.method == "POST":
        # ADD A USER
        data = JSONParser().parse(request)
        serializer = serializers.UsersSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            instance = models.Users.objects.get(username=data['username'])
            SerializedData = serializers.ViewUsersSerializer(
                instance, many=False)
            return JsonResponse(SerializedData.data, status=status.HTTP_200_OK)
        return JsonResponse({
            "message": "Username or email already exists"
        },  status=status.HTTP_200_OK)
    if request.method == "PUT":
        # UPDATE A USER
        if pk is None:
            return JsonResponse({"message": "No user id given"}, safe=False)
        data = JSONParser().parse(request)
        instance = models.Users.objects.get(pk=int(pk))
        object = serializers.ViewUsersSerializer(instance, data=data)
        if object.is_valid():
            object.save()
            return JsonResponse(object.data, status=status.HTTP_200_OK)
        print(object.errors)
        return JsonResponse({
            "message": "Username/Email already exists"
        },  status=status.HTTP_200_OK)


def encode_string(string: str):
    return str(base64.b64encode(string.encode()).decode('UTF-8'))


def decode_string(key):
    return str(base64.b64decode(key).decode('UTF-8'))


@api_view(['POST', 'PUT', 'GET'])
def reset(request):
    if request.method == 'GET':
        string = 'data to be encoded'
        encoded = encode_string(string)
        decoded = decode_string(encoded)
        return JsonResponse(
            {"encoded": encoded, "decoded": decoded}, status=status.HTTP_200_OK
        )
    if request.method == 'POST':
        users = models.Users.objects.filter(
            email=request.data["email"])
        if len(users) > 0:
            token = encode_string(str(request.data["email"]))
            user = serializers.ViewUsersSerializer(users[0], many=False)
            print(token, user)
            try:
                models.Users.objects.filter(pk=int(user.data["id"])).update(
                    token=token)
                send_forget_password_mail(
                    user.data["email"], token, request.data["client_url"])
                return JsonResponse(
                    {}, status=status.HTTP_200_OK
                )
            except Exception as e:
                print(e)
                return JsonResponse(
                    {"message": "System error!"}, status=status.HTTP_200_OK
                )
        return JsonResponse(
            {"message": "No user with this email exists!"}, status=status.HTTP_200_OK
        )
    if request.method == 'PUT':
        users = models.Users.objects.filter(
            token=request.data["token"], email=decode_string(request.data["token"]))
        if len(users) > 0 and request.data["token"] != "":
            user = serializers.ViewUsersSerializer(users[0], many=False)
            try:
                models.Users.objects.filter(pk=int(user.data["id"])).update(
                    password=make_password(request.data["password"]), token="")
                return JsonResponse(
                    {}, status=status.HTTP_200_OK
                )
            except Exception as e:
                print(e)
                return JsonResponse(
                    {"message": "System error!"}, status=status.HTTP_200_OK
                )
        return JsonResponse(
            {"message": "Reset token expired!"}, status=status.HTTP_200_OK
        )


@api_view(['POST', 'PUT', 'GET'])
def search_books(request, pk=None):
    if request.method == 'GET':
        user = request.GET.get('user', None)
        if user is None:
            return JsonResponse({"message": "No user id given!"}, status=status.HTTP_200_OK)
        results = service.volumes().get(volumeId=pk).execute()
        try:
            query = models.UserBooks.objects.get(
                book=results["id"], user=int(user))
            results["shelf"] = serializers.ViewUserBooksSerializer(query).data
        except:
            results["shelf"] = ""

        return JsonResponse(results, status=status.HTTP_200_OK)
    if request.method == 'POST':
        data = JSONParser().parse(request)
        search_query = data["search_query"]
        results = service.volumes().list(q=search_query, maxResults=40).execute()
        books = []
        for item in results.get('items', []):
            book = {
                'id': item['id'],
                'title': item['volumeInfo']['title'] if 'title' in item['volumeInfo'] else 'Unknown Title',
                'author': item['volumeInfo'].get('authors', ['Unknown'])[0],
                'description': item['volumeInfo'].get('description', 'No description available.'),
                'imageLinks': item['volumeInfo'].get('imageLinks', {}),
            }
            books.append(book)
        return JsonResponse(books, status=status.HTTP_200_OK, safe=False)
    return JsonResponse([], status=status.HTTP_200_OK, safe=False)


@api_view(['POST', 'PUT', 'GET', 'DELETE'])
def comment(request, pk=None):
    if request.method == "GET":
        # GET COMMENTS BY ID
        if pk is None:
            return JsonResponse({"message": "No book id given"}, safe=False)
        instance = models.Comments.objects.filter(
            book=pk).order_by("-timestamp")
        object = serializers.ViewCommentsSerializer(instance, many=True)
        data = []
        for one in object.data:
            data.append({
                **one,
                "replies": serializers.ViewRepliesSerializer(models.Replies.objects.filter(comment__id=one["id"]).order_by("-timestamp"), many=True).data
            })
        return JsonResponse(data, safe=False)
    if request.method == "POST":
        # ADD A COMMENT
        data = JSONParser().parse(request)
        serializer = serializers.CommentsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            count_of_comments = models.Comments.objects.filter(
                by_user__id=int(data["by_user"])).first()
            if count_of_comments is not None:
                assign_tropy("review", int(data["by_user"]))
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse({
            "message": "System error. Please try again."
        },  status=status.HTTP_200_OK)
    if request.method == "PUT":
        # UPDATE A COMMENT
        if pk is None:
            return JsonResponse({"message": "No comment id given"}, safe=False)
        data = JSONParser().parse(request)
        instance = models.Comments.objects.get(pk=int(pk))
        object = serializers.CommentsSerializer(instance, data=data)
        if object.is_valid():
            object.save()
            return JsonResponse(object.data, status=status.HTTP_200_OK)
        print(object.errors)
        return JsonResponse({
            "message": "System error. Please try again."
        },  status=status.HTTP_200_OK)
    if request.method == "DELETE":
        # DELETE A COMMENT
        if pk is None:
            return JsonResponse({"message": "No comment id given"}, safe=False)
        instance = models.Comments.objects.get(pk=int(pk))
        instance.delete()
        return JsonResponse({},  status=status.HTTP_200_OK)


@api_view(['POST', 'PUT', 'DELETE'])
def reply(request, pk=None):
    if request.method == "POST":
        # ADD A REPLY
        data = JSONParser().parse(request)
        serializer = serializers.RepliesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse({
            "message": "System error. Please try again."
        },  status=status.HTTP_200_OK)
    if request.method == "PUT":
        # UPDATE A REPLY
        if pk is None:
            return JsonResponse({"message": "No reply id given"}, safe=False)
        data = JSONParser().parse(request)
        instance = models.Replies.objects.get(pk=int(pk))
        object = serializers.RepliesSerializer(instance, data=data)
        if object.is_valid():
            object.save()
            return JsonResponse(object.data, status=status.HTTP_200_OK)
        print(object.errors)
        return JsonResponse({
            "message": "System error. Please try again."
        },  status=status.HTTP_200_OK)
    if request.method == "DELETE":
        # DELETE A REPLY
        if pk is None:
            return JsonResponse({"message": "No reply id given"}, safe=False)
        instance = models.Replies.objects.get(pk=int(pk))
        instance.delete()
        return JsonResponse({},  status=status.HTTP_200_OK)


@api_view(['POST', 'PUT', 'GET', 'DELETE'])
def shelf(request, pk=None):
    if request.method == "GET":
        # GET SHELFS BY USER ID
        if pk is None:
            return JsonResponse({"message": "No user id given"}, safe=False)
        global_shelfs = models.Shelfs.objects.filter(
            is_global=True).order_by("-timestamp")
        global_shelfs_data = serializers.ViewShelfsSerializer(
            global_shelfs, many=True)
        instance = models.Shelfs.objects.filter(
            user__id=pk).order_by("-timestamp")
        object = serializers.ViewShelfsSerializer(instance, many=True)
        data = global_shelfs_data.data + object.data
        return JsonResponse(data, safe=False)
    if request.method == "POST":
        # ADD A SHELF
        data = JSONParser().parse(request)
        serializer = serializers.ShelfsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse({
            "message": "System error. Please try again."
        },  status=status.HTTP_200_OK)
    if request.method == "DELETE":
        # DELETE A SHELF
        if pk is None:
            return JsonResponse({"message": "No shelf id given"}, safe=False)
        instance = models.Shelfs.objects.get(pk=int(pk))
        instance.delete()
        return JsonResponse({},  status=status.HTTP_200_OK)


@api_view(['POST', 'PUT', 'GET', 'DELETE'])
def userbooks(request, pk=None):
    if request.method == "GET":
        # GET SHELFS WITH BOOKS BY USER ID
        user = request.GET.get('user', None)
        if user is None:
            return JsonResponse({"message": "No user id given!"}, status=status.HTTP_200_OK)
        if pk is None:
            return JsonResponse({"message": "No shelf id given"}, safe=False)
        query = models.UserBooks.objects.filter(
            user__id=user, shelf__id=pk).order_by("-timestamp")
        serializer = serializers.UserBooksSerializer(
            query, many=True)
        final = []
        for one in serializer.data:
            final.append({
                **one,
                "book": service.volumes().get(volumeId=one["book"]).execute()
            })
        return JsonResponse(final, safe=False)
    if request.method == "POST":
        # ADD A BOOK IN SHELF
        data = JSONParser().parse(request)
        try:
            query = models.UserBooks.objects.get(
                book=data["book"], user=int(data["user"]))
            query.delete()
        except:
            pass
        serializer = serializers.UserBooksSerializer(data=data)
        if serializer.is_valid():
            instance = serializer.save()
            query = models.UserBooks.objects.get(pk=instance.id)
            return JsonResponse(serializers.ViewUserBooksSerializer(query).data, status=status.HTTP_200_OK)
        print(serializer.errors)
        return JsonResponse({
            "message": "System error. Please try again."
        },  status=status.HTTP_200_OK)
    if request.method == "DELETE":
        # DELETE A BOOK IN SHELF
        if pk is None:
            return JsonResponse({"message": "No id given"}, safe=False)
        instance = models.UserBooks.objects.get(pk=int(pk))
        instance.delete()
        return JsonResponse({},  status=status.HTTP_200_OK)


@api_view(['POST', 'PUT', 'GET', 'DELETE'])
def userprogress(request, pk=None):
    if request.method == "GET":
        # GET LAST 7 DAYS RECORD OF PAGE READ FOR CURRENT BOOK
        book = request.GET.get('book', None)
        if book is None:
            return JsonResponse({"message": "No book id given!"}, status=status.HTTP_200_OK)
        if pk is None:
            return JsonResponse({"message": "No shelf id given"}, safe=False)
        today = timezone.now().date()
        last_week = today - timezone.timedelta(days=7)
        records = models.UserProgress.objects.filter(
            user__id=pk,
            book=book,
            timestamp__date__gte=last_week,
            timestamp__date__lte=today,
        ).order_by("-timestamp")
        serializer = serializers.UserProgressSerializer(records, many=True)
        if len(records) == 7:
            assign_tropy("r7d", pk)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)
    if request.method == "POST":
        # ADD A PAGE READ FOR CURRENT BOOK
        data = JSONParser().parse(request)
        user_id = int(data["user"])
        book = data["book"]
        is_completed = data["is_completed"]
        today = timezone.now().date()
        try:
            progress = models.UserProgress.objects.get(
                user__id=user_id,
                book=book,
                timestamp__date=today,
            )
            # A record already exists for today
            progress.pages_read = int(data["pages_read"])
        except:
            # No record for today yet
            user = models.Users.objects.get(pk=user_id)
            points = 0
            points += int(data["pages_read"])  # Casual
            if int(data["pages_read"]) > 100:
                assign_tropy("r100go", user_id)
            if is_completed:
                points += 100  # Bonus
                user.books_completed = user.books_completed + 1
                if user.books_completed >= 1:
                    assign_tropy("r1b", user_id)
                if user.books_completed >= 10:
                    assign_tropy("r10b", user_id)
                if user.books_completed >= 100:
                    assign_tropy("r100b", user_id)
            user.points += points
            user.save()
            progress = models.UserProgress(
                user=user,
                book=book,
                pages_read=int(data["pages_read"]),
            )
        progress.save()
        serializer = serializers.UserProgressSerializer(progress)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST', 'PUT', 'GET', 'DELETE'])
def usertrophies(request, pk=None):
    if request.method == "GET":
        # GET TROPHIES BY USER ID
        if pk is None:
            return JsonResponse({"message": "No user id given"}, safe=False)
        global_trophies = models.Trophies.objects.all().order_by("id")
        global_trophies_data = serializers.TrophiesSerializer(
            global_trophies, many=True)
        instance = models.UserTrophies.objects.filter(
            user__id=pk).order_by("-id")
        object = serializers.UserTrophiesSerializer(instance, many=True)
        user = models.Users.objects.get(pk=pk)
        if len(object.data) == len(global_trophies_data.data)-1:
            assign_tropy("ultimate", pk)

        total_pages_read = get_pages_read(pk)
        if total_pages_read >= 100:
            assign_tropy("r100p", pk)
        if total_pages_read >= 1000:
            assign_tropy("r1000p", pk)
        if total_pages_read >= 10000:
            assign_tropy("r10000p", pk)

        for trophy in global_trophies_data.data:
            trophy['has_trophy'] = False
            for user_trophy in object.data:
                if trophy['id'] == user_trophy['tropy']:
                    trophy['has_trophy'] = True
                    break
            if not trophy['has_trophy']:  # what's % left
                if trophy["code"] == "r10b":
                    trophy['percentage'] = (user.books_completed/10)*100
                elif trophy["code"] == "r100b":
                    trophy['percentage'] = (user.books_completed/100)*100
                elif trophy["code"] == "r100p":
                    trophy['percentage'] = (total_pages_read/100)*100
                elif trophy["code"] == "r1000p":
                    trophy['percentage'] = (total_pages_read/1000)*100
                elif trophy["code"] == "r10000p":
                    trophy['percentage'] = (total_pages_read/10000)*100
                elif trophy["code"] in ["r1b", "review", "r100go", "r7d", "ultimate"]:
                    trophy['percentage'] = 0
            else:
                trophy['percentage'] = 100
        return JsonResponse(global_trophies_data.data, safe=False)
    if request.method == "POST":
        top_users = models.Users.objects.exclude(
            username="admin").order_by('-points')[:10]
        object = serializers.ViewUsersSerializer(top_users, many=True)
        return JsonResponse(object.data, safe=False)


def get_pages_read(user_id):
    pages_read = models.UserProgress.objects.filter(
        user__id=user_id).aggregate(Sum('pages_read'))
    return pages_read['pages_read__sum'] or 0


@api_view(['POST', 'PUT', 'GET', 'DELETE'])
def update_info(request, pk=None):
    if request.method == "PUT":
        data = JSONParser().parse(request)
        if data["type"] != "" and data["user_id"] != "" and data["payload"] != "":
            user = models.Users.objects.get(pk=int(data["user_id"]))
            if data["type"] == "description":
                user.description = data["payload"]
            elif data["type"] == "review":
                user.review = data["payload"]
            elif data["type"] == "settings":
                if data["payload"]["password"] != "":
                    user.password = make_password(data["payload"]["password"])
                if data["payload"]["profile_picture"] != "":
                    user.profile_picture = data["payload"]["profile_picture"]
            user.save()
    return JsonResponse({}, safe=False)


@api_view(['POST', 'PUT', 'GET', 'DELETE'])
def forumpost(request, pk=None):
    if request.method == "GET":
        # GET FORUM POSTS
        query = models.ForumPost.objects.order_by("-timestamp")
        array = serializers.ViewForumPostSerializer(
            query, many=True)
        for one in array.data:
            one["no_of_replies"] = models.ForumPostReplies.objects.filter(
                forum__id=one["id"]).count()
            try:
                one["first_reply"] = serializers.ViewForumPostRepliesSerializer(
                    models.ForumPostReplies.objects.filter(
                        forum__id=one["id"]).order_by(
                        "-timestamp").first()).data
            except:
                one["first_reply"] = None
        return JsonResponse(array.data, safe=False)
    if request.method == "POST":
        # ADD A FORUM POST
        data = JSONParser().parse(request)
        serializer = serializers.ForumPostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse({
            "message": "System error. Please try again."
        },  status=status.HTTP_200_OK)
    if request.method == "PUT":
        # GET A FORUM POST
        data = JSONParser().parse(request)
        query = models.ForumPost.objects.get(pk=int(data["forum"]))
        array = serializers.ViewForumPostSerializer(
            query)
        return JsonResponse(array.data, safe=False)
    if request.method == "DELETE":
        # DELETE A FORUM POST
        if pk is None:
            return JsonResponse({"message": "No id given"}, safe=False)
        instance = models.ForumPost.objects.get(pk=int(pk))
        instance.delete()
        return JsonResponse({},  status=status.HTTP_200_OK)


@api_view(['POST', 'PUT', 'GET', 'DELETE'])
def forumpostreplies(request, pk=None):
    if request.method == "GET":
        # GET FORUM POSTS
        query = models.ForumPostReplies.objects.filter(
            forum__id=pk).order_by("-timestamp")
        array = serializers.ViewForumPostRepliesSerializer(
            query, many=True)
        return JsonResponse(array.data, safe=False)
    if request.method == "POST":
        # ADD A FORUM POST
        data = JSONParser().parse(request)
        serializer = serializers.ForumPostRepliesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse({
            "message": "System error. Please try again."
        },  status=status.HTTP_200_OK)
    if request.method == "PUT":
        # UPDATE A FORUM POST
        data = JSONParser().parse(request)
        if data["mode"] == "replies" and data["mode"] is not None:
            query = models.ForumPostReplies.objects.get(pk=int(pk))
            data_object = serializers.ForumPostRepliesSerializer(
                query, data=data)
            if data_object.is_valid():
                data_object.save()
                return JsonResponse(data_object.data, status=status.HTTP_200_OK)
            print(data_object.errors)
        else:
            query = models.ForumPost.objects.get(pk=int(pk))
            data_object = serializers.ForumPostSerializer(
                query, data=data)
            if data_object.is_valid():
                data_object.save()
                return JsonResponse(data_object.data, status=status.HTTP_200_OK)
            print(data_object.errors)
        return JsonResponse({
            "message": "System error. Please try again."
        },  status=status.HTTP_200_OK)
    if request.method == "DELETE":
        # DELETE A FORUM POST REPLY
        if pk is None:
            return JsonResponse({"message": "No id given"}, safe=False)
        instance = models.ForumPostReplies.objects.get(pk=int(pk))
        instance.delete()
        return JsonResponse({},  status=status.HTTP_200_OK)
