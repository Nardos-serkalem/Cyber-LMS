import { useCourses } from "../../lib/queries/useCourses";
import { useCertificates } from "../../lib/queries/useCertificates";
import { useAuthStore } from "../../store/authStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export function CertificatesPage() {
  const userId = useAuthStore((s) => s.userId);
  const { data: courses, isLoading: coursesLoading } = useCourses();
  // Certificates aren't part of the backend yet (see handoff doc) — this still
  // reads from mock data for now, just no longer on a hardcoded fake user id.
  const { data: certificates, isLoading: certsLoading } = useCertificates(userId ?? "");

  if (coursesLoading || certsLoading) {
    return <div className="text-sm text-surface-muted">Loading certificates…</div>;
  }

  const courseTitle = (courseId: string) => courses?.find((c) => c.id === courseId)?.title ?? "Untitled course";

  return (
    <div className="grid grid-cols-2 gap-3">
      {certificates?.map((cert) => (
        <Card key={cert.id}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-navy-900">{courseTitle(cert.courseId)}</span>
            <Badge status="certified" />
          </div>
          <p className="text-xs text-surface-muted">Issued {cert.issuedAt}</p>
          <p className="mt-1 text-xs text-surface-muted">Verification: {cert.verificationHash}</p>
        </Card>
      ))}
      {certificates?.length === 0 && <div className="text-sm text-surface-muted">No certificates earned yet.</div>}
    </div>
  );
}