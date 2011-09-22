from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'gitcalendar.views.home', name='home'),
    # url(r'^gitcalendar/', include('gitcalendar.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^repos/', 'main.views.get_repos'),
    url(r'^commits/', 'main.views.get_commits'),
    url(r'^$', 'main.views.view_calendar'),
)
