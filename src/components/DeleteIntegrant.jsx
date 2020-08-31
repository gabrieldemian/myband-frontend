import React from 'react'
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useStateValue } from '../services/StateProvider';

export default function DeleteIntegrant ({ integrantToDelete, setIntegrantToDelete, context }) {

  const [{ userGlobal }, dispatch ] = useStateValue();

  const deleteMember = async () => {
    // delete member
    console.log(integrantToDelete._id)
    await api.delete('/bandMember', {
      headers: {
        userid: integrantToDelete._id,
        context
      }
    });
    
    console.log('integrant: ', integrantToDelete);
    setIntegrantToDelete();

    dispatch({
      type: 'acceptInvite',
      acceptInvite: { acceptInvite: false }
    })
    toast.success(`${context === 'CreatorLeave' ? 'Banda excluída com sucesso' : context === 'CreatorBan' ? integrantToDelete.name + ' foi expulso' : 'Você saiu da banda'}`)
  }

  return (
    <Dialog
      open={integrantToDelete}
      onClose={() => setIntegrantToDelete()}
      maxWidth="sm"
      fullWidth={true}
    >
      {
        integrantToDelete ? <>

      <DialogTitle>{context === 'CreatorLeave' ? 'Deletar banda' : context === 'CreatorBan' ? 'Expulsar membro' : 'Sair da banda'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja
            {context === 'CreatorLeave' ? ' deletar a sua banda?' : context === 'CreatorBan' ? ` expulsar o membro ${integrantToDelete.name}?` : ' sair da banda?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIntegrantToDelete()} color="primary">
            Não
          </Button>
          <Button onClick={() => deleteMember()} color="primary">
            Sim
          </Button>
        </DialogActions>
        </>
        : ''
      }
    </Dialog>
  )
}
