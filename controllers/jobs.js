const Jobs = require("../models/Job");
const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res) => {
  const jobs = await Jobs.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
// get a single job
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Jobs.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`no job found for the id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
// create job
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Jobs.create(req.body);
  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("empty cannot be taken");
  }
  const job = await Jobs.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`no job found for the id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Jobs.findOneAndRemove({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError("no job of this id is founded.");
  }
  res.json("Job deleted.");
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
