import Dataset, { Commit } from "./models/dataset"
import cloneDeep from 'clone-deep'

import Store, { CommitDetails, Status } from "./models/store"

// combines working dataset and mutations dataset to return most
// up-to-date version of the edited dataset
export function selectMutationsDataset (state: Store): Dataset {
  const { mutations } = state
  const mutationsDataset = mutations.dataset.value

  const dataset = selectWorkingDataset(state)
  const d = { ...dataset, ...mutationsDataset }
  return d
}

export function selectHistoryCommit (state: Store): Commit | undefined {
  return selectHistoryDataset(state).commit
}

// returns a dataset that only contains components
export function selectHistoryDataset (state: Store): Dataset {
  return datasetFromCommitDetails(state.commitDetails)
}

export function selectHistoryDatasetRef (state: Store): string {
  return `${state.commitDetails.peername}/${state.commitDetails.name}/at${state.commitDetails.path}`
}

export function selectHistoryStatus (state: Store): Status {
  return state.commitDetails.status
}

export function selectIsCommiting (state: Store): boolean {
  return state.mutations.save.isLoading
}

export function selectIsLinked (state: Store): boolean {
  return !!state.workingDataset.fsiPath && state.workingDataset.fsiPath !== ''
}

export function selectMutationsCommit (state: Store): Commit {
  return state.mutations.save.value
}

export function selectStatusFromMutations (state: Store): Status {
  const { workingDataset, mutations } = state
  const mutationsStatus = mutations.status.value

  return { ...workingDataset.status, ...mutationsStatus }
}

// returns a dataset that only contains components
export function selectWorkingDataset (state: Store): Dataset {
  return datasetFromCommitDetails(state.workingDataset)
}

export function selectWorkingDatasetIsLoading (state: Store): boolean {
  return state.workingDataset.isLoading
}

export function selectWorkingDatasetName (state: Store): string {
  return state.workingDataset.name
}

export function selectWorkingDatasetPeername (state: Store): string {
  return state.workingDataset.peername
}

// returns username/datasetname
export function selectWorkingDatasetRef (state: Store): string {
  return `${state.workingDataset.peername}/${state.workingDataset.name}`
}

export function selectWorkingStatus (state: Store): Status {
  return state.workingDataset.status
}

function datasetFromCommitDetails (commitDetails: CommitDetails): Dataset {
  const { components } = commitDetails
  let d: Dataset = {}

  Object.keys(components).forEach((componentName: string) => {
    if (componentName === 'bodyPath') return
    if (components[componentName].value) {
      d[componentName] = cloneDeep(components[componentName].value)
    }
  })
  return d
}
