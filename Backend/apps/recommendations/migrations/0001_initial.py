from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("accounts", "0005_remove_candidateprofile_extracurricular_activities_and_more"),
        ("jobs", "0007_alter_job_job_descriptions_alter_job_salary_max_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="JobRecommendation",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("score", models.FloatField(default=0)),
                ("reason", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "candidate",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="job_recommendations", to="accounts.candidateprofile"),
                ),
                (
                    "job",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="recommendations", to="jobs.job"),
                ),
            ],
            options={
                "ordering": ["-score", "-created_at"],
                "unique_together": {("candidate", "job")},
            },
        ),
    ]