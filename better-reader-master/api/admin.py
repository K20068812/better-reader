from django.contrib.auth.models import Group
from django.contrib import admin
from . import models
# Register your models here.


class UserAdmin(admin.ModelAdmin):
    exclude = ('groups', 'user_permissions',
               'is_staff', 'is_active', 'is_superuser', 'last_login', 'date_joined')
    list_display = ('pk', 'username', 'email', 'is_admin',)
    list_filter = ('is_staff',)

    def is_admin(self, obj):
        pl = "✔️" if obj.is_staff else "❌"
        return pl


admin.site.register(models.Users, UserAdmin)
admin.site.register(models.Shelfs)
admin.site.register(models.Comments)
admin.site.register(models.Replies)
admin.site.register(models.UserBooks)
admin.site.register(models.UserProgress)
admin.site.register(models.Trophies)
admin.site.register(models.UserTrophies)


admin.site.site_header = "🎮 Book Reader Management System ✨"
admin.site.site_title = "Admin"
admin.site.index_title = "Website Administration"

admin.site.unregister(Group)
