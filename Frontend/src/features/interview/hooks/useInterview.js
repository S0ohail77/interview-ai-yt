import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useCallback, useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.context.js"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context
    const [error, setError] = useState("")

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError("")
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response.interviewReport
        } finally {
            setLoading(false)
        }
    }

    const getReportById = useCallback(async (reportId) => {
        setLoading(true)
        setError("")
        try {
            const response = await getInterviewReportById(reportId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            setReport(null)
            setError(error.response?.data?.message || error.message || "Unable to load this interview plan.")
            return null
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport])

    const getReports = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const response = await getAllInterviewReports()
            if (!Array.isArray(response?.interviewReports)) {
                throw new Error("The server returned an invalid interview report list.")
            }
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (error) {
            setReports([])
            setError(error.response?.data?.message || error.message || "Unable to load your interview plans.")
            return []
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReports])

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        setError("")
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.setTimeout(() => window.URL.revokeObjectURL(url), 1000)
        }
        catch (error) {
            setError(error.response?.data?.message || error.message || "Unable to download the resume.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId, getReportById, getReports ])

    return { loading, error, report, reports, generateReport, getReportById, getReports, getResumePdf }

}