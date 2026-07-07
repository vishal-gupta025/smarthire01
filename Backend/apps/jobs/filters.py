import django_filters
from .models import Job

class JobFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(
        field_name="title",
        lookup_expr="icontains"
    )

    location = django_filters.CharFilter(
        field_name="location",
        lookup_expr="icontains"
    )

    job_type = django_filters.CharFilter(
        field_name="job_type",
        lookup_expr="iexact"
    )

    max_experience = django_filters.NumberFilter(
        field_name="experience_required",
        lookup_expr="lte"
    )

    min_salary = django_filters.NumberFilter(
        field_name="salary_min",
        lookup_expr="gte"
    )

    max_salary = django_filters.NumberFilter(
        field_name="salary_max",
        lookup_expr="lte"
    )

    class Meta:
        model = Job
        fields = []
